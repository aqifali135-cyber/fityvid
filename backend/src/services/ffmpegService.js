import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { randomBytes } from 'crypto';

const FFMPEG_CMD = process.env.FFMPEG_PATH || 'ffmpeg';

let ffmpegChecked = false;
let ffmpegAvailable = false;

const isDev = process.env.NODE_ENV !== 'production';

function devLog(...args) {
  if (isDev) {
    console.log('[ffmpegService]', ...args);
  }
}

function runCommand(command, args, timeoutMs = 300000) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      shell: process.platform === 'win32',
      windowsHide: true,
    });

    let stderr = '';
    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error('FFmpeg timed out'));
    }, timeoutMs);

    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });

    proc.on('close', (code) => {
      clearTimeout(timer);
      if (code !== 0) {
        reject(new Error(stderr.trim() || `FFmpeg exited with code ${code}`));
        return;
      }
      resolve();
    });
  });
}

export async function checkFfmpeg() {
  if (ffmpegChecked) return ffmpegAvailable;
  ffmpegChecked = true;
  try {
    await runCommand(FFMPEG_CMD, ['-version'], 15000);
    ffmpegAvailable = true;
    devLog('FFmpeg is available');
  } catch {
    ffmpegAvailable = false;
    devLog('FFmpeg is NOT available — host backend on Render/Railway/VPS with FFmpeg for Instagram audio merge');
  }
  return ffmpegAvailable;
}

export async function createTempDir() {
  const base = process.env.TEMP_DIR || path.join(os.tmpdir(), 'fityvid');
  const dir = path.join(base, randomBytes(8).toString('hex'));
  await fs.mkdir(dir, { recursive: true });
  return dir;
}

export async function cleanupDir(dir) {
  if (!dir) return;
  try {
    await fs.rm(dir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
}

/**
 * Merge video and audio files into one MP4.
 */
/**
 * Merge local video and audio files into MP4 (used for Instagram downloads).
 */
export async function mergeVideoAudio(videoPath, audioPath, outputPath) {
  devLog('Merging', videoPath, '+', audioPath, '->', outputPath);
  await runCommand(FFMPEG_CMD, [
    '-y',
    '-i',
    videoPath,
    '-i',
    audioPath,
    '-c:v',
    'copy',
    '-c:a',
    'aac',
    '-shortest',
    outputPath,
  ]);
  devLog('Merge complete:', outputPath);
  return outputPath;
}

export async function findFirstFile(dir, prefix) {
  const files = await fs.readdir(dir);
  const match = files.find((f) => f.startsWith(prefix));
  return match ? path.join(dir, match) : null;
}
