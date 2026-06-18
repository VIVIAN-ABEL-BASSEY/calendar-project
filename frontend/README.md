# Task Myr — Frontend

A Google Calendar–style task management app. Built with React, TypeScript, Redux Toolkit and plain CSS.

## Features

- Month, week and day calendar views with a view toggle
- Drag and drop tasks between days
- Task groups ("calendars") with consistent auto-generated colors
- JWT authentication with session restore across page refreshes
- Google OAuth login
- Toast notifications and an on-demand "remind me" email button
- Mini calendar with task indicators in the sidebar

## Tech Stack

- React + TypeScript (Vite)
- Redux Toolkit + React Redux
- React Router
- Axios (with request/response interceptors for auth)
- date-fns
- Plain CSS with design tokens (no framework)

## Project Structure

```
src/
├── api/             # axios client + per-resource API functions
├── app/              # redux store + typed hooks
├── features/         # redux slices (auth, tasks, groups, calendar)
├── components/
│   ├── layout/         # app shell, topbar, sidebar, mini calendar
│   ├── calendar/        # month/week/day views, task chips, popovers
│   ├── tasks/             # task modal, group modal
│   └── ui/                  # spinner, toast container
├── pages/            # login, register, calendar, auth callback
├── router/           # routes + protected route guard
├── styles/           # tokens.css, reset.css, global.css, etc.
├── types/             # shared TypeScript types
├── utils/              # date helpers, token storage, group color hashing
└── hooks/               # useToast
```

## Environment / Configuration

This project doesn't use a `.env` file for the API URL in development — it relies on the Vite dev server proxy in `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': 'http://localhost:5000'
  }
}
```

For production, the proxy won't exist (there's no Vite dev server in production), so you need to point requests at your deployed backend. The cleanest way is to introduce an environment variable.

### Before deploying, make this small change

Create a `.env.production` file:

```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

Then update `src/api/axiosClient.ts`:

```ts
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api'
})
```

This way, in development it still falls back to the Vite proxy (`/api`), and in production it uses your deployed backend's full URL.

Also update every hardcoded `http://localhost:5000` reference (the Google OAuth button href, and the refresh token raw axios call) to use the same env variable, or better, a constant:

```ts
// e.g. in a small constants file
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api'
```

## Local Development

```bash
npm install
npm run dev
```

App runs on `http://localhost:5173` by default. Requires the backend running on `http://localhost:5000`.

## Build

```bash
npm run build
```

Outputs static files to `dist/`.

## Deployment (Vercel)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and click **Add New → Project**
3. Import the repo
4. Vercel auto-detects Vite — leave build settings as default (`npm run build`, output directory `dist`)
5. Add the environment variable:
   - `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com/api`
6. Deploy
7. Once deployed, copy your Vercel URL (e.g. `https://task-myr.vercel.app`)

### After deploying, update the backend

Your backend needs to know your frontend's live URL for two things — CORS and OAuth redirects:

1. In your backend's environment variables (Render), set `FRONTEND_URL` to your Vercel URL
2. In Google Cloud Console, add your Vercel URL to **Authorized JavaScript origins**
3. Redeploy the backend so the new `FRONTEND_URL` takes effect

### After updating the backend, redeploy the frontend

If you changed `VITE_API_BASE_URL`, trigger a new Vercel deployment so the build picks up the new value (Vite environment variables are baked in at build time, not read at runtime).

## Known Limitations / Next Steps

- No automated tests yet
- Resend free tier restricts real reminder emails to the account owner's address until a domain is verified
- Collaborations (assigning tasks to other users) not yet implemented
- No recurring tasks
- No dark mode