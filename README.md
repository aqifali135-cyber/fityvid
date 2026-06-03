# FityVid

Lightweight video downloader info site and hashtag generator for **YouTube**, **Facebook**, **TikTok**, and **Instagram** only.

## Project structure

```
fity/
├── backend/          # Node.js Express API
│   └── src/
│       ├── routes/videoRoutes.js
│       ├── controllers/videoController.js
│       ├── services/videoService.js
│       └── utils/platformDetector.js
└── frontend/         # React + Vite
    └── src/
        ├── pages/HashtagGenerator.jsx
        └── components/
            ├── HashtagForm.jsx
            ├── HashtagResult.jsx
            └── HashtagChip.jsx
```

## Requirements

- Node.js 18+
- **yt-dlp** (required for real video metadata and downloads)
- **FFmpeg** (required for Instagram downloads with audio — use Render, Railway, or VPS; not available on most Namecheap shared hosting)

### Install yt-dlp

**Windows (winget):**
```powershell
winget install yt-dlp
```

**Windows (pip):**
```powershell
pip install yt-dlp
```

**macOS:**
```bash
brew install yt-dlp
```

**Linux:**
```bash
sudo pip install -U yt-dlp
```

Verify:
```bash
yt-dlp --version
ffmpeg -version
```

### Hosting (Namecheap + backend)

- Deploy **frontend** on Namecheap with `VITE_API_BASE_URL=https://your-backend.onrender.com`
- Deploy **backend** on Render, Railway, or a VPS where **yt-dlp** and **FFmpeg** are installed
- Instagram thumbnails are proxied via `/api/video/thumbnail` to avoid broken images
- Instagram videos are merged with FFmpeg when video and audio are separate streams

## Setup

### 1. Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

API runs at `http://localhost:8787`

### 2. Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Site runs at `http://localhost:5173`. Set `VITE_API_BASE_URL=http://localhost:8787` in `frontend/.env`.

### Production build

```bash
# Frontend
cd frontend
npm run build

# Backend
cd backend
npm start
```

Set `VITE_API_BASE_URL` in `frontend/.env` if the API is on a different host:

```
VITE_API_BASE_URL=https://your-api-domain.com
```

### Deploy frontend on Vercel

Vercel must deploy **`frontend/`** as a **Vite static site**, not the Express backend.

**Recommended (fixes “No entrypoint found”):**

1. Vercel → **Project → Settings → General → Root Directory** → set to **`frontend`** → Save.
2. **Settings → Build & Deployment**:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `dist` (default)
   - Clear any **Production Overrides** (yellow warning) so they match the above.
3. **Environment Variables** → add:
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com
   ```
4. Redeploy.

**If Root Directory stays at repo root:** root `vercel.json` sets `"framework": "vite"` and builds `frontend/dist`. Do **not** add a root `package.json` (that triggers Node/backend detection).

Deploy the **backend** on Render, Railway, or a VPS (yt-dlp + FFmpeg). Vercel is frontend-only.

## API

### POST `/api/video/info`

Fetches real video metadata via yt-dlp.

**Request:**
```json
{ "url": "https://www.youtube.com/watch?v=VIDEO_ID" }
```

**Response:**
```json
{
  "success": true,
  "platform": "youtube",
  "title": "Video title",
  "thumbnail": "https://...",
  "duration": "2:35",
  "formats": [
    {
      "quality": "1080p",
      "format": "mp4",
      "size": "125 MB",
      "downloadUrl": "/api/download?url=...&format=137&title=...&ext=mp4"
    }
  ]
}
```

### GET `/api/download`

Streams the file with `Content-Disposition: attachment`. Query params: `url`, `format`, `title`, `ext`.

### POST `/api/hashtags/generate`

**Request:**

```json
{
  "topic": "fitness",
  "platform": "instagram",
  "type": "mixed",
  "count": 30
}
```

**Response:**

```json
{
  "success": true,
  "topic": "fitness",
  "platform": "instagram",
  "type": "mixed",
  "count": 30,
  "hashtags": ["#fitness", "#fitnessmotivation"],
  "captionIdea": "Start your fitness journey today and stay consistent."
}
```

## Local testing

```powershell
# Test video info (replace with a public video URL)
curl -X POST http://localhost:8787/api/video/info -H "Content-Type: application/json" -d "{\"url\":\"https://www.youtube.com/watch?v=jNQXAC9IVRw\"}"

# Test yt-dlp directly
yt-dlp -J "https://www.youtube.com/watch?v=jNQXAC9IVRw"
```

## Features

- Real video metadata and downloads via yt-dlp (YouTube, Facebook, TikTok, Instagram)
- Hashtag Generator with platform, type, and count options
- Local smart hashtag generation (`hashtagService.js`) — ready to swap for an AI API later
- Mobile-friendly UI with light modern colors
- Updated legal pages and disclaimers

## Connecting AI later

Replace or extend `backend/src/services/hashtagService.js` — keep the same export:

```js
export function generateHashtags({ topic, platform, type, count }) {
  // return { hashtags, captionIdea }
}
```

## License

Use responsibly. Respect copyright and platform terms of service.
