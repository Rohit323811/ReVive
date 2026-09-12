# 🌱 ReVive

> **Don't throw it away. Give it another life.**

ReVive is an **AI-powered upcycling app** built for the **Next Step 2026 hackathon**.
Snap a photo of something you were about to throw out — a bottle, a box, an old tee — and
ReVive identifies it with **Grok Vision**, scores its **Second Life Score (0–100)**, and generates
step-by-step reuse projects with real environmental and financial impact stats.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Postgres-3FCF8E?logo=supabase&logoColor=white)

---

## ✨ Features

- 📸 **Scan anything** — upload a photo or shoot straight from the camera; drag & drop supported
- 🧠 **Grok Vision analysis** — object, category, confidence, and a Second Life Score
- 💡 **3 reuse ideas per scan** — difficulty, time, cost, materials, and full step-by-step guides
- 📊 **Impact dashboard** — waste diverted (kg), money saved (USD), and a daily reuse streak
- 🔖 **My Revivals** — save projects, revisit guides, remove what you finished
- ☁️ **Supabase auth** — optional accounts; everything works without one
- 🌓 **Dark/light theme**, animated with Framer Motion, fully responsive (mobile tab bar included)
- 🛟 **Zero-config demo mode** — no API keys? A curated offline catalog keeps every flow clickable

---

## 🏗️ How it works

```
User photo (upload / camera)
        │  client-side downscale to ≤1024 px JPEG (fast + tiny)
        ▼
POST /api/analyze        ← Vercel Edge Function (api/analyze.ts)
        │  XAI_API_KEY stays server-side — never in the browser
        ▼
Grok Vision (grok-4.6)   →  strict JSON: object, score, ideas, steps, impact
        ▼
Interactive results      →  Second Life Score · ideas · step guide · impact dashboard
```

If `/api/analyze` is missing, erroring, or rate-limited, the client **falls back to a curated demo
catalog** — the app is *always* presentable, even when the free AI tier runs dry mid-demo.

## 🧰 Tech stack

| Layer | Choice | Why |
|---|---|---|
| UI | React 19 + TypeScript + Vite | fast DX, strict types |
| Motion / icons | Framer Motion · lucide-react | polished animations, clean iconography |
| AI | Grok (`grok-4.6`) via xAI API | multimodal vision, structured JSON output |
| Backend | Vercel Edge Function (`/api/analyze`) | server-side API key, no server to manage |
| Auth & data | Supabase (Postgres + RLS) | email/password auth, row-level security |
| Hosting | Vercel | zero-config SPA + Edge Functions |

---

## 🚀 Run locally

```bash
# 1. Install dependencies
npm install

# 2. (Optional) configure keys — skip to run in demo mode
cp .env.example .env
#    → fill in XAI_API_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

# 3. Start the dev server (includes the Grok dev proxy)
npm run dev
```

Open **http://localhost:5173**. Without keys the app runs in **demo mode**: scanning a photo or a
demo tile returns curated results, and the Account page shows a setup guide instead of a login form.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server + `/api/analyze` Grok proxy |
| `npm run build` | type-check (`tsc --noEmit`) then production build to `dist/` |
| `npm run preview` | serve the production build locally |
| `npm run typecheck` | TypeScript check only |

---

## ▲ Deploy to Vercel

1. **Push this repo to GitHub** (GitLab/Bitbucket work too).
2. Go to [vercel.com/new](https://vercel.com/new) and **import the repository**.
   Vercel auto-detects Vite — `vercel.json` already pins the build command, output dir,
   SPA rewrites, and Edge Function routing.
3. Add **Environment Variables** (Project → Settings → Environment Variables):

   | Variable | Required | Notes |
   |---|---|---|
   | `XAI_API_KEY` | for real AI scans | server-side only — the Edge Function reads it, the browser never sees it. Get one at [console.x.ai](https://console.x.ai) |
   | `VITE_SUPABASE_URL` | for accounts | public URL, safe to expose |
   | `VITE_SUPABASE_ANON_KEY` | for accounts | public anon key, protected by RLS in `supabase/schema.sql` |

4. **Deploy.** That's it — static app + `/api/analyze` Edge Function ship together.

> Prefer one click? [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2FReVive&env=XAI_API_KEY,VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY)
> (replace `YOUR_USERNAME/ReVive` with your repo).

**No keys set on Vercel?** The deployment still works end-to-end in demo mode — great for judges who
just want to click around.

### Supabase setup (optional, 2 minutes)

1. Create a free project at [supabase.com](https://supabase.com).
2. Run the SQL in [`supabase/schema.sql`](supabase/schema.sql) (Dashboard → SQL Editor) — it creates
   the `revivals` + `profiles` tables with row-level security.
3. Copy the project URL + anon key into `.env` / Vercel env vars.

### 🔐 Secrets & configuration

All three variables are documented in [`.env.example`](.env.example) (placeholder values only —
never real keys). How they flow:

- **Local dev** → real values live in `.env` (git-ignored, never committed)
- **GitHub** → only source code + `.env.example` placeholders
- **Vercel** → real values go in Project → Settings → Environment Variables (all environments)

`.env` is excluded via `.gitignore` (along with `.env.local`, `.env.*.local`, and other secret
files). `XAI_API_KEY` is read exclusively server-side (`api/analyze.ts`, Vite dev proxy) and is
never bundled into client JavaScript — only `VITE_*` variables reach the browser.

---

## 🎬 90-second demo script

1. **Home** → *"Don't throw it away. Give it another life."* → click **Give It a Second Life**
2. **Scan** → upload/take a photo (or tap a demo tile) → staged AI analysis plays
3. **Results** → object identity, **Second Life Score**, and 3 ranked reuse ideas
4. **Project guide** → materials, tools, difficulty, time, step-by-step instructions, pro tip
5. **Save** → *Mark complete & save* → watch **Impact** update: kg diverted, $ saved, streak 🔥
6. **Account** → sign up / sign in (Supabase) — optional, the whole app works signed out

---

## 📁 Project structure

```
api/
  analyze.ts               # Vercel Edge Function → Grok Vision (server-side key)
src/
  components/              # AppShell, ScoreRing, Steps
  data/objects.ts          # curated demo catalog (7 objects, full guides)
  lib/
    analyze.ts             # client pipeline: prepare → /api/analyze → fallback
    aiObjects.ts           # localStorage cache for AI-identified objects
    image.ts               # client-side downscale (payload + EXIF safety)
    stages.ts / icons.ts / format.ts / theme.ts / supabase.ts
  pages/                   # Home, Scan, Results, Project, Revivals, Dashboard, About, Account
  store/                   # auth + revivals (React context)
supabase/
  schema.sql               # tables + RLS policies (idempotent)
  functions/grok-proxy/    # optional Supabase Edge twin of /api/analyze
vercel.json                # SPA rewrites, security headers, asset caching
.env.example               # copy to .env, or mirror on Vercel
```

## 🔌 `/api/analyze` contract

```
POST /api/analyze
{ "imageBase64": "<base64 JPEG/PNG>", "mimeType": "image/jpeg" }

200 → { "analysis": { objectName, category, emoji, confidence, secondLifeScore,
                      tagline, ideas[3], estimatedWasteKg, estimatedSavingsUsd } }
4xx/5xx → { "error": string, "code"?: string }
```

---

## 🗺️ What's next

- Cloud sync of *My Revivals* for signed-in users (schema is ready — `supabase/schema.sql`)
- Cloud AI analysis for the Supabase Edge twin (`supabase/functions/grok-proxy`)
- Barcode/packaging recognition for faster, cheaper identification
- Community gallery: share your completed revivals

---

<div align="center">

**Built with 🌱 for Next Step 2026**

*Recycling is a chore. Reinvention is a thrill.*

</div>
