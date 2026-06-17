# Task Myr — Backend

A REST API for a Google Calendar–style task management app. Built with Node.js, Express, TypeScript and MongoDB.

## Features

- JWT authentication (access + refresh tokens) with bcrypt password hashing
- Google OAuth 2.0 login via Passport
- Task CRUD scoped to the authenticated user
- Task groups (calendars/buckets) CRUD
- Automatic email reminders via a cron job (Resend)
- Manual on-demand reminder endpoint

## Tech Stack

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- Passport.js (Google OAuth 2.0)
- jsonwebtoken, bcrypt
- node-cron
- Resend (email delivery)

## Project Structure

```
src/
├── config/          # db connection, jwt helpers, passport strategy
├── middleware/       # auth middleware
├── modules/
│   ├── auth/          # register, login, refresh, Google OAuth, /me
│   ├── task/           # task CRUD
│   ├── taskGroup/      # group CRUD
│   ├── notifications/  # manual reminder endpoint
│   └── user/            # user model
├── utils/             # email service, reminder cron, hashing
├── types/
├── app.ts
└── server.ts
```

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=5000

# MongoDB
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_ACCESS_SECRET=your_access_token_secret
JWT_REFRESH_SECRET=your_refresh_token_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=onboarding@resend.dev

# Frontend
FRONTEND_URL=http://localhost:5173
```

> In production, update `GOOGLE_CALLBACK_URL` and `FRONTEND_URL` to your deployed domains, and update the Google Cloud Console OAuth client with the new authorized origins and redirect URI.

## Local Development

```bash
npm install
npm run dev
```

Server runs on `http://localhost:5000` by default.

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create a new account |
| POST | `/api/auth/login` | Log in with email/password |
| POST | `/api/auth/refresh` | Exchange a refresh token for a new access token |
| GET | `/api/auth/me` | Get the current authenticated user |
| GET | `/api/auth/google` | Start Google OAuth flow |
| GET | `/api/auth/google/callback` | Google OAuth callback (redirects to frontend) |

### Tasks
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | List the authenticated user's tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |

### Task Groups
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/task-groups` | List the authenticated user's groups |
| POST | `/api/task-groups` | Create a group |

### Notifications
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/notifications/remind` | Send an on-demand reminder email for a task |

All endpoints except `/register`, `/login`, `/refresh`, and the Google OAuth routes require an `Authorization: Bearer <accessToken>` header.

## Deployment (Render)

This API can be deployed on [Render](https://render.com) for free.

1. Push this repo to GitHub
2. On Render, click **New → Web Service** and connect the repo
3. Set **Build Command**: `npm install && npm run build` (or `npm install` if you run via ts-node-dev — see note below)
4. Set **Start Command**: `npm start`
5. Add every variable from `.env` above under **Environment**
6. Deploy

> **Note on build/start commands:** if your `package.json` doesn't yet have a `build`/`start` script for compiled JS, you have two options — either add a `tsc` build step and run the compiled `dist/server.js`, or run `ts-node src/server.ts` directly in production (slightly slower cold start but simpler). For a learning project, running `ts-node` directly is perfectly fine.

7. Once deployed, copy the live URL (e.g. `https://task-myr-api.onrender.com`)
8. Update `FRONTEND_URL` in Render's environment variables once the frontend is deployed
9. Update your Google Cloud Console OAuth client:
   - **Authorized JavaScript origin**: your Render URL
   - **Authorized redirect URI**: `https://task-myr-api.onrender.com/api/auth/google/callback`
10. Update `GOOGLE_CALLBACK_URL` in Render's environment variables to match

## MongoDB

If you're not already using MongoDB Atlas, create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and whitelist `0.0.0.0/0` (allow access from anywhere) so Render can connect, or add Render's specific outbound IPs.

## Email Notes

Resend's free tier only allows sending to the email address used to create the account, unless you verify a domain. To send reminder emails to real users in production, verify a domain at [resend.com/domains](https://resend.com/domains) and update `FROM_EMAIL` to use that domain.