#!/usr/bin/env bash
set -euo pipefail

if ! command -v yt-dlp >/dev/null 2>&1; then
  if command -v pip3 >/dev/null 2>&1; then
    pip3 install --user -U yt-dlp
  elif command -v python3 >/dev/null 2>&1; then
    python3 -m pip install --user -U yt-dlp
  fi
fi

npm install --omit=dev
