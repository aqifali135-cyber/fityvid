import path from 'path';
import fs from 'fs/promises';
import { createReadStream } from 'fs';
import {
  checkFfmpeg,
  createTempDir,
  cleanupDir,
  mergeVideoAudio,
  findFirstFile,
} from './ffmpegService.js';
import { runYtDlp, spawnYtDlp } from '../utils/ytdlpRunner.js';

const INSTAGRAM_MERGE_FORMAT =
  'bestvideo[ext=mp4]+bestaudio[ext=m4a]/bestvideo+bestaudio/best[ext=mp4]/best';

const isDev = process.env.NODE_ENV !== 'production';

export function devLogInstagram(...args) {
  if (isDev) {
    console.log('[instagram]', ...args);
  }
}

function isHttpUrl(value) {
  return typeof value === 'string' && /^https?:\/\//i.test(value);
}

export function extractInstagramThumbnail(info) {
  const fromThumbnails = [...(info.thumbnails || [])]
    .sort((a, b) => (b.width || 0) - (a.width || 0))
    .map((t) => t.url)
    .filter(isHttpUrl);

  const candidates = [
    info.thumbnail,
    info.thumbnail_url,
    info.display_url,
    info.cover,
    ...fromThumbnails,
  ].filter(isHttpUrl);

  const picked = [...new Set(candidates)][0] || null;
  devLogInstagram('thumbnail URL received:', picked || '(none)');
  return picked;
}

export function buildThumbnailProxyUrl(thumbnailUrl, videoUrl) {
  if (!thumbnailUrl || !videoUrl) return null;
  const params = new URLSearchParams({
    source: thumbnailUrl,
    video: videoUrl,
  });
  return `/api/video/thumbnail?${params.toString()}`;
}

function formatFileSize(bytes) {
  if (!bytes || Number(bytes) <= 0) return 'Size may vary';
  const mb = Number(bytes) / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
  if (mb >= 1) return `${Math.round(mb)} MB`;
  return `${Math.max(1, Math.round(mb))} MB`;
}

function formatHasAudio(format) {
  return format.acodec && format.acodec !== 'none';
}

export function buildInstagramFormats(info, sourceUrl, buildDownloadPath) {
  const raw = info.formats || [];
  const progressive = raw.filter(
    (f) =>
      f.url &&
      f.vcodec &&
      f.vcodec !== 'none' &&
      formatHasAudio(f) &&
      (f.ext === 'mp4' || f.ext === 'webm'),
  );

  const videoOnly = raw
    .filter(
      (f) =>
        f.url &&
        f.vcodec &&
        f.vcodec !== 'none' &&
        !formatHasAudio(f) &&
        (f.ext === 'mp4' || f.ext === 'webm'),
    )
    .sort((a, b) => (b.height || 0) - (a.height || 0));

  const bestAudio = raw
    .filter((f) => f.url && formatHasAudio(f) && (!f.vcodec || f.vcodec === 'none'))
    .sort((a, b) => (b.abr || 0) - (a.abr || 0))[0];

  const formats = [];
  const seen = new Set();

  const addFormat = (entry) => {
    if (seen.has(entry.quality)) return;
    seen.add(entry.quality);
    formats.push(entry);
  };

  const bestProgressive = progressive.sort((a, b) => (b.height || 0) - (a.height || 0))[0];
  if (bestProgressive) {
    devLogInstagram('video URL received (progressive):', bestProgressive.format_id);
    addFormat({
      quality: bestProgressive.height >= 720 ? 'HD' : `${bestProgressive.height || 'SD'}p`,
      format: 'mp4',
      size: formatFileSize(bestProgressive.filesize || bestProgressive.filesize_approx),
      formatId: String(bestProgressive.format_id),
      audioIncluded: true,
      needsMerge: false,
      downloadUrl: buildDownloadPath({
        videoUrl: sourceUrl,
        formatId: String(bestProgressive.format_id),
        title: info.title,
        ext: 'mp4',
        platform: 'instagram',
        needsMerge: false,
      }),
    });
  }

  const topVideo = videoOnly[0];
  const needsMerge = Boolean(topVideo && bestAudio);
  devLogInstagram('video URL received:', topVideo?.format_id || '(none)');
  devLogInstagram('audio URL received:', bestAudio?.format_id || '(none)');
  devLogInstagram('whether merge is required:', needsMerge);

  if (needsMerge || !bestProgressive) {
    const mergeId =
      topVideo && bestAudio
        ? `${topVideo.format_id}+${bestAudio.format_id}`
        : INSTAGRAM_MERGE_FORMAT;

    addFormat({
      quality: topVideo?.height >= 720 ? 'HD' : topVideo?.height ? `${topVideo.height}p` : 'HD',
      format: 'mp4',
      size: formatFileSize(
        (topVideo?.filesize || 0) + (bestAudio?.filesize || 0) || info.filesize_approx,
      ),
      formatId: mergeId,
      audioIncluded: Boolean(bestAudio || !topVideo),
      needsMerge: true,
      downloadUrl: buildDownloadPath({
        videoUrl: sourceUrl,
        formatId: mergeId,
        title: info.title,
        ext: 'mp4',
        platform: 'instagram',
        needsMerge: true,
      }),
    });
  }

  if (formats.length === 0) {
    addFormat({
      quality: 'HD',
      format: 'mp4',
      size: formatFileSize(info.filesize || info.filesize_approx),
      formatId: INSTAGRAM_MERGE_FORMAT,
      audioIncluded: true,
      needsMerge: true,
      downloadUrl: buildDownloadPath({
        videoUrl: sourceUrl,
        formatId: INSTAGRAM_MERGE_FORMAT,
        title: info.title,
        ext: 'mp4',
        platform: 'instagram',
        needsMerge: true,
      }),
    });
  }

  if (!formats.some((f) => f.audioIncluded)) {
    const last = formats[formats.length - 1];
    if (last) {
      last.audioIncluded = false;
      last.audioNote = 'Audio not available for this video.';
    }
  }

  devLogInstagram('final download URL:', formats[0]?.downloadUrl);
  return formats;
}

export async function streamInstagramDownload(videoUrl, formatId, title, res) {
  const safeName = (title || 'video').replace(/[<>:"/\\|?*]/g, '').slice(0, 80);
  const mergeFormat = formatId || INSTAGRAM_MERGE_FORMAT;

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Disposition', `attachment; filename="${safeName || 'video'}.mp4"`);

  const ffmpegOk = await checkFfmpeg();

  if (ffmpegOk) {
    const tmpDir = await createTempDir();
    try {
      devLogInstagram('Downloading video + audio streams for FFmpeg merge...');
      await runYtDlp(
        [
          '-f',
          'bestvideo[ext=mp4]/bestvideo',
          '--no-playlist',
          '--no-warnings',
          '-o',
          path.join(tmpDir, 'video.%(ext)s'),
          videoUrl,
        ],
        180000,
      );

      let audioPath = null;
      try {
        await runYtDlp(
          [
            '-f',
            'bestaudio[ext=m4a]/bestaudio',
            '--no-playlist',
            '--no-warnings',
            '-o',
            path.join(tmpDir, 'audio.%(ext)s'),
            videoUrl,
          ],
          180000,
        );
        audioPath = await findFirstFile(tmpDir, 'audio');
      } catch {
        devLogInstagram('Separate audio download failed');
      }

      const videoPath = await findFirstFile(tmpDir, 'video');
      if (!videoPath) throw new Error('Video stream not found');

      const outputPath = path.join(tmpDir, 'output.mp4');

      if (audioPath) {
        await mergeVideoAudio(videoPath, audioPath, outputPath);
      } else {
        await fs.copyFile(videoPath, outputPath);
      }

      const stream = createReadStream(outputPath);
      stream.pipe(res);
      await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
        res.on('close', resolve);
      });
      devLogInstagram('Instagram FFmpeg merge download complete');
      return;
    } catch (err) {
      devLogInstagram('FFmpeg merge failed:', err.message);
      if (res.headersSent) {
        res.end();
        return;
      }
    } finally {
      await cleanupDir(tmpDir);
    }
  }

  devLogInstagram('Using yt-dlp stdout merge');
  const proc = spawnYtDlp([
    '-f',
    mergeFormat,
    '--merge-output-format',
    'mp4',
    '--no-playlist',
    '--no-warnings',
    '-o',
    '-',
    videoUrl,
  ]);

  proc.stdout.pipe(res);
  proc.stderr.on('data', (chunk) => {
    if (isDev) console.error('[yt-dlp ig]', chunk.toString().slice(0, 200));
  });

  return new Promise((resolve, reject) => {
    proc.on('error', reject);
    proc.on('close', (code) => {
      if (code !== 0 && !res.writableEnded) {
        reject(new Error('Unable to prepare video with audio. Please try again.'));
      } else {
        resolve();
      }
    });
    res.on('close', () => {
      if (!proc.killed) proc.kill();
    });
  });
}
