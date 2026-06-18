// src/config/apiConfig.ts

// In development this falls back to '/api' which the Vite proxy
// forwards to http://localhost:5000 (see vite.config.ts).
// In production, set VITE_API_BASE_URL to your deployed backend,
// e.g. https://task-myr-api.onrender.com/api
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'