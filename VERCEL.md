# Deploy FityVid frontend on Vercel

If you see **“No entrypoint found in /vercel/path0”**, Vercel is trying to run the project as a **Node server**. FityVid’s UI is a **static Vite app** in `frontend/` only.

## Fix (do all steps)

### 1. Root Directory

**Project → Settings → General → Root Directory**

| Setting | Value |
|--------|--------|
| Root Directory | **`frontend`** |

Click **Save**.

### 2. Framework & build (clear overrides)

**Project → Settings → Build & Deployment**

| Setting | Value |
|--------|--------|
| Framework Preset | **Other** (not Express, not Node server) |
| Build Command | *(leave empty — `vercel.json` runs `vercel-build`)* |
| Output Directory | *(leave empty — uses `dist` from static build)* |
| Install Command | `npm install` |

If you see a **yellow “Production Overrides”** banner, open it and **reset** to match the table, or delete overrides.

### 3. Environment variable

**Settings → Environment Variables**

| Name | Value |
|------|--------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com` (your API URL, no trailing slash) |

Apply to **Production**, **Preview**, and **Development**.

### 4. Push & redeploy

Commit and push `frontend/vercel.json` and `frontend/package.json` (`vercel-build` script), then **Redeploy** from the Deployments tab.

## Do not deploy on Vercel

- **`backend/`** — needs yt-dlp + FFmpeg. Use Render, Railway, or a VPS.

## Two valid setups

**A (recommended):** Root Directory = `frontend` → uses `frontend/vercel.json` + `@vercel/static-build`.

**B:** Root Directory = empty (repo root) → uses root `vercel.json` which builds `frontend/package.json`.

Use **one** setup; prefer **A**.
