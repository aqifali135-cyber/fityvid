import { spawn } from 'child_process';
import { getFfmpegPath } from '../services/ffmpegService.js';

const EXTRACTOR_CANDIDATES = [
  { command: 'yt-dlp', prefix: [] },
  { command: 'python3', prefix: ['-m', 'yt_dlp'] },
  { command: 'python', prefix: ['-m', 'yt_dlp'] },
  { command: 'py', prefix: ['-m', 'yt_dlp'] },
];

const YOUTUBE_PLAYER_CLIENTS = [
  'default,web,android,tv_embedded',
  'android,web',
  'tv_embedded,web',
  'ios,web',
  'mweb,web',
];

let ytDlpChecked = false;
let ytDlpAvailable = false;
let extractorConfig = null;
let ytDlpVersion = null;

function runCommand(command, args, timeoutMs = 120000) {
  return new Promise((resolve, reject) => {
    const proc = spawn(command, args, {
      shell: process.platform === 'win32',
      windowsHide: true,
    });

    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      proc.kill();
      reject(new Error('Video extraction timed out'));
    }, timeoutMs);

    proc.stdout.on('data', (chunk) => {
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
        reject(new Error(stderr.trim() || `${command} exited with code ${code}`));
        return;
      }
      resolve(stdout);
    });
  });
}

async function resolveExtractor() {
  if (extractorConfig) return extractorConfig;

  const fromEnv = process.env.VIDEO_EXTRACTOR;
  if (fromEnv && fromEnv !== 'yt-dlp') {
    const candidates = [{ command: fromEnv, prefix: [] }];
    if (fromEnv === 'python-module') {
      candidates[0] = { command: 'python3', prefix: ['-m', 'yt_dlp'] };
    }
    for (const c of candidates) {
      try {
        const version = await runCommand(c.command, [...c.prefix, '--version'], 15000);
        ytDlpVersion = version.trim();
        extractorConfig = c;
        return c;
      } catch {
        /* try next */
      }
    }
    return null;
  }

  for (const c of EXTRACTOR_CANDIDATES) {
    try {
      const version = await runCommand(c.command, [...c.prefix, '--version'], 15000);
      ytDlpVersion = version.trim();
      extractorConfig = c;
      return c;
    } catch {
      /* try next */
    }
  }
  return null;
}

export async function checkYtDlp() {
  if (ytDlpChecked) return ytDlpAvailable;
  ytDlpChecked = true;
  extractorConfig = await resolveExtractor();
  ytDlpAvailable = Boolean(extractorConfig);
  return ytDlpAvailable;
}

export function getExtractorConfig() {
  return extractorConfig;
}

export function getYtDlpVersion() {
  return ytDlpVersion;
}

function appendOptionalArgs(args, platform) {
  const next = [...args];

  if (process.env.YTDLP_EXTRA_ARGS) {
    next.push(...process.env.YTDLP_EXTRA_ARGS.split(/\s+/).filter(Boolean));
  }

  if (platform === 'youtube' && process.env.YOUTUBE_COOKIES_FILE) {
    next.push('--cookies', process.env.YOUTUBE_COOKIES_FILE);
  }

  return next;
}

export function buildInfoArgs(url, platform, youtubeClientIndex = 0) {
  const args = ['-J', '--no-playlist', '--no-warnings', '--retries', '3', '--socket-timeout', '30'];

  if (platform === 'youtube') {
    const clients = YOUTUBE_PLAYER_CLIENTS[youtubeClientIndex] ?? YOUTUBE_PLAYER_CLIENTS[0];
    args.push('--extractor-args', `youtube:player_client=${clients}`);
  }

  return appendOptionalArgs([...args, url], platform);
}

export function buildDownloadArgs(formatId, videoUrl, platform, youtubeClientIndex = 0) {
  const args = [
    '-f',
    formatId,
    '--merge-output-format',
    'mp4',
    '--no-playlist',
    '--no-warnings',
    '--retries',
    '3',
    '--socket-timeout',
    '60',
    '-o',
    '-',
  ];

  args.push('--ffmpeg-location', getFfmpegPath());

  if (platform === 'youtube') {
    const clients = YOUTUBE_PLAYER_CLIENTS[youtubeClientIndex] ?? YOUTUBE_PLAYER_CLIENTS[0];
    args.push('--extractor-args', `youtube:player_client=${clients}`);
  }

  return appendOptionalArgs([...args, videoUrl], platform);
}

export function runYtDlp(args, timeoutMs = 120000) {
  if (!extractorConfig) {
    throw new Error('yt-dlp not available');
  }
  return runCommand(extractorConfig.command, [...extractorConfig.prefix, ...args], timeoutMs);
}

export async function runYtDlpWithYoutubeFallback(url, platform, timeoutMs = 120000) {
  if (platform !== 'youtube') {
    return runYtDlp(buildInfoArgs(url, platform), timeoutMs);
  }

  let lastError;
  for (let i = 0; i < YOUTUBE_PLAYER_CLIENTS.length; i += 1) {
    try {
      return await runYtDlp(buildInfoArgs(url, platform, i), timeoutMs);
    } catch (err) {
      lastError = err;
      const msg = (err.message || '').toLowerCase();
      const retryable =
        msg.includes('sign in') ||
        msg.includes('bot') ||
        msg.includes('confirm') ||
        msg.includes('403') ||
        msg.includes('429') ||
        msg.includes('unable to extract') ||
        msg.includes('player response');

      if (!retryable || i === YOUTUBE_PLAYER_CLIENTS.length - 1) {
        throw err;
      }
    }
  }

  throw lastError || new Error('YouTube extraction failed');
}

export function spawnYtDlp(args) {
  if (!extractorConfig) {
    throw new Error('yt-dlp not available');
  }
  return spawn(extractorConfig.command, [...extractorConfig.prefix, ...args], {
    shell: process.platform === 'win32',
    windowsHide: true,
  });
}

export function isYoutubeBotError(message = '') {
  const msg = message.toLowerCase();
  return (
    msg.includes('sign in to confirm') ||
    msg.includes('not a bot') ||
    msg.includes('cookies') ||
    msg.includes('429') ||
    msg.includes('403 forbidden') ||
    msg.includes('unable to extract') ||
    msg.includes('player response')
  );
}
