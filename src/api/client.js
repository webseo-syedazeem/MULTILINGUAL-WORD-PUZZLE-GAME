import { API_BASE_URL, isBackendConfigured } from "./config";

class OfflineModeError extends Error {
  constructor(message = "Backend is currently in offline mode.") {
    super(message);
    this.name = "OfflineModeError";
  }
}

async function request(path, { method = "GET", token, body, timeoutMs = 6000 } = {}) {
  if (!isBackendConfigured()) throw new OfflineModeError();

  const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller ? controller.signal : undefined,
    });

    let data = null;
    try {
      data = await res.json();
    } catch (e) {
      // no/invalid JSON body
    }

    if (!res.ok) {
      const message = (data && data.error) || `Request failed (${res.status})`;
      throw new Error(message);
    }
    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Network request timed out. Please check your connection.");
    }
    throw err;
  } finally {
    if (timer) clearTimeout(timer);
  }
}

export const authRegister = (email, password, displayName, avatar) =>
  request("/api/auth/register", { method: "POST", body: { email, password, displayName, avatar } });

export const authLogin = (email, password) =>
  request("/api/auth/login", { method: "POST", body: { email, password } });

export const fetchMe = (token) => request("/api/auth/me", { token });

export const patchProfile = (token, { displayName, avatar }) =>
  request("/api/auth/profile", { method: "PATCH", token, body: { displayName, avatar } });

export const getProgress = (token) => request("/api/progress", { token });

export const putProgress = (token, state) =>
  request("/api/progress", { method: "PUT", token, body: state });

export const completeLevelRemote = (token, language, levelId, stars) =>
  request("/api/progress/complete-level", {
    method: "POST",
    token,
    body: { language, levelId, stars },
  });

export const completeDailyChallengeRemote = (token, rewardCoins) =>
  request("/api/progress/complete-daily-challenge", {
    method: "POST",
    token,
    body: { rewardCoins },
  });

export const fetchLeaderboard = (limit = 25, filter = "coins") =>
  request(`/api/leaderboard?limit=${limit}&filter=${filter}`);

export const checkHealth = () => request("/health", { timeoutMs: 3000 });

export { OfflineModeError };
