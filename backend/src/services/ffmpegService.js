import { spawn } from 'child_process';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { randomBytes } from 'crypto';
import ffmpegStaticPath from 'ffmpeg-static';

let ffmpegChecked = false;
let ffmpegAvailable = false;
let ffmpegVersion = null;
let resolvedFfmpegPath = null;

const isDev = process.env.NODE_ENV !== 'production';

function devLog(...args) {
  if (isDev) {
    console.log('[ffmpegService]', ...args);
  }
}

export function getFfmpegPath() {
  if (!resolvedFfmpegPath) {
    resolvedFfmpegPath =
      process.env.FFMPEG_PATH ||
      (typeof ffmpegStaticPath === 'string' && ffmpegStaticPath ? ffmpegStaticPath : null) ||
      'ffmpeg';
  }
  return resolvedFfmpegPath;
}

function runCommand(command, args, timeoutMs = 300000) {
  return new Promise((resolve, reject) => {
    const useShell = command === 'ffmpeg' && process.platform === 'win32';
    const proc = spawn(command, args, {
      shell: useShell,
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';
    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error('FFmpeg timed out'));
    }, timeoutMs);

    proc.stdout?.on('data', (chunk) => {
      stdout += chunk.toString();
    });

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
      resolve(stdout || stderr);
    });
  });
}

export function getFfmpegVersion() {
  return ffmpegVersion;
}

export function getFfmpegVersionShort() {
  if (!ffmpegVersion) return null;
  return ffmpegVersion.match(/ffmpeg version ([^\s,]+)/i)?.[1] || null;
}

export async function checkFfmpeg() {
  if (ffmpegChecked) return ffmpegAvailable;
  ffmpegChecked = true;

  const ffmpegPath = getFfmpegPath();

  try {
    const output = await runCommand(ffmpegPath, ['-version'], 15000);
    ffmpegVersion = String(output).split('\n')[0]?.trim() || null;
    ffmpegAvailable = true;
    devLog('FFmpeg is available:', getFfmpegVersionShort() || ffmpegVersion);
  } catch (err) {
    ffmpegAvailable = false;
    ffmpegVersion = null;
    devLog('FFmpeg is NOT available', err.message);
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
 * Merge local video and audio files into MP4 (used for Instagram downloads).
 */
export async function mergeVideoAudio(videoPath, audioPath, outputPath) {
  devLog('Merging', videoPath, '+', audioPath, '->', outputPath);
  await runCommand(getFfmpegPath(), [
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
