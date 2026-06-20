import path from 'path';
import { createReadStream } from 'fs';
import {
  checkFfmpeg,
  createTempDir,
  cleanupDir,
  mergeVideoAudio,
  findFirstFile,
} from './ffmpegService.js';
import { runYtDlp, spawnYtDlp } from '../utils/ytdlpRunner.js';
import {
  buildPublicFormat,
  pickBestAudioStream,
  pickBestVideoOnlyStream,
  pickProgressiveStreams,
} from '../utils/formatHelpers.js';

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

export function buildInstagramFormats(info, sourceUrl, buildDownloadPath) {
  const raw = info.formats || [];
  const progressive = pickProgressiveStreams(raw);
  const videoOnly = pickBestVideoOnlyStream(raw);
  const bestAudio = pickBestAudioStream(raw);

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
    addFormat(
      buildPublicFormat({
        quality: bestProgressive.height >= 720 ? 'HD' : `${bestProgressive.height || 'SD'}p`,
        videoFormat: bestProgressive,
        formatId: bestProgressive.format_id,
        sourceUrl,
        title: info.title,
        platform: 'instagram',
        buildDownloadPath,
      }),
    );
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

    addFormat(
      buildPublicFormat({
        quality: topVideo?.height >= 720 ? 'HD' : topVideo?.height ? `${topVideo.height}p` : 'HD',
        videoFormat: topVideo || { format_id: mergeId, ext: 'mp4', vcodec: 'unknown' },
        audioFormat: bestAudio,
        needsMerge: true,
        formatId: mergeId,
        sourceUrl,
        title: info.title,
        platform: 'instagram',
        buildDownloadPath,
      }),
    );
  }

  if (formats.length === 0) {
    addFormat(
      buildPublicFormat({
        quality: 'HD',
        videoFormat: { format_id: INSTAGRAM_MERGE_FORMAT, ext: 'mp4', vcodec: 'unknown' },
        needsMerge: true,
        formatId: INSTAGRAM_MERGE_FORMAT,
        sourceUrl,
        title: info.title,
        platform: 'instagram',
        buildDownloadPath,
      }),
    );
  }

  if (!formats.some((f) => f.hasAudio || f.needsMerge)) {
    const last = formats[formats.length - 1];
    if (last) {
      last.hasAudio = false;
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
  const requiresMerge =
    String(mergeFormat).includes('+') || String(mergeFormat).includes('best');

  if (requiresMerge) {
    const ffmpegOk = await checkFfmpeg();
    if (!ffmpegOk) {
      throw new Error(
        'Audio merging is unavailable on the server. Please choose a lower quality format that includes audio.',
      );
    }
  }

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
        throw new Error('Audio stream not found for merge');
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
