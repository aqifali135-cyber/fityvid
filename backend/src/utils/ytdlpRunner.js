import { spawn } from 'child_process';

const EXTRACTOR_CANDIDATES = [
  { command: 'yt-dlp', prefix: [] },
  { command: 'python', prefix: ['-m', 'yt_dlp'] },
  { command: 'py', prefix: ['-m', 'yt_dlp'] },
];

let ytDlpChecked = false;
let ytDlpAvailable = false;
let extractorConfig = null;

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
      candidates[0] = { command: 'python', prefix: ['-m', 'yt_dlp'] };
    }
    for (const c of candidates) {
      try {
        await runCommand(c.command, [...c.prefix, '--version'], 15000);
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
      await runCommand(c.command, [...c.prefix, '--version'], 15000);
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

export function runYtDlp(args, timeoutMs = 120000) {
  if (!extractorConfig) {
    throw new Error('yt-dlp not available');
  }
  return runCommand(extractorConfig.command, [...extractorConfig.prefix, ...args], timeoutMs);
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
