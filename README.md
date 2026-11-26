# Tajik Sado AI — Phase 1

Phase 1 establishes the application shell, a responsive 3D city scene, destination selection, a small multilingual destination command, and a FastAPI status/world-data API. It intentionally does **not** implement the avatar, AI, voice, or later phases yet. The world is built from interactive Three.js geometry so no external model download is needed.

## Requirements

- Node.js 20.19+ (or 22.12+) and npm
- Python 3.10+

## Install

From the repository root:

```bash
npm install
python -m venv .venv
# macOS/Linux
source .venv/bin/activate
# Windows PowerShell: .venv\Scripts\Activate.ps1
pip install -r backend/requirements.txt
```

## Run

Start the API in one terminal:

```bash
uvicorn backend.main:app --reload --port 8000
```

Start the frontend in another terminal:

```bash
npm run dev
```

Open the URL Vite prints (normally http://localhost:5173). Vite proxies `/api` requests to the local FastAPI server.

Optional backend configuration: copy `.env.example` to `.env` and set `FRONTEND_ORIGINS` to a comma-separated list of allowed frontend origins. No AI credentials are needed in Phase 1.

## Test

```bash
# Frontend TypeScript check and production bundle
npm run build

# API tests using curl
curl http://localhost:8000/api/health
curl http://localhost:8000/api/locations

# Frontend proxy/API check
curl http://localhost:5173/api/health
```

Manual browser checks: change EN/RU/TG, select a location in the left list and by clicking its 3D building, orbit with drag, zoom with the wheel, use the +/−/compass controls, submit a known destination in the text-command field, and toggle the ambient-sound UI setting. The sound toggle is only a UI setting in this phase; there is no audio playback or microphone access. API status should change to online when the backend is running.

## Files added

- `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`, `tailwind.config.js`, `postcss.config.js` — React/TypeScript/Vite/Tailwind setup.
- `src/main.tsx`, `src/App.tsx`, `src/styles.css` — application entry, dashboard and responsive styling.
- `src/data/locations.ts` — typed multilingual location data and UI labels.
- `src/world/WorldScene.tsx` — interactive React Three Fiber town scene, buildings, park, trees, road, lighting and orbit camera.
- `backend/main.py`, `backend/requirements.txt` — FastAPI health and world-location endpoints.
- `.gitignore` — excludes generated and local files.

Existing typing-test files are preserved.
