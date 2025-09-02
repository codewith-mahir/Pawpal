import axios from 'axios';

// Determine API base URL with environment override and sensible fallbacks
// - REACT_APP_API_URL: e.g. http://192.168.1.100:5000/api for cross-device/dev
// - Same-host fallback: http(s)://<current-host>:5000/api when running client and server on same machine
// - Final fallback: http://localhost:5000/api
export function resolveBaseURL() {
  const envUrl = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim();
  if (envUrl) return envUrl;

  if (typeof window !== 'undefined' && window.location) {
    const { protocol, hostname } = window.location;
    // Preserve current page protocol (http or https) in case of dev over https via proxy
    return `${protocol}//${hostname}:5000/api`;
  }

  return 'http://localhost:5000/api';
}

const instance = axios.create({
  baseURL: resolveBaseURL(),
});

instance.interceptors.request.use((config) => {
  const userRaw = typeof localStorage !== 'undefined' ? localStorage.getItem('user') : null;
  try {
    const user = userRaw ? JSON.parse(userRaw) : null;
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch (_) {
    // ignore malformed localStorage
  }
  return config;
});

export default instance;

// Media base URL (for images under /uploads) derived from API base
export function getMediaBaseURL() {
  const envUrl = process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.trim();
  if (envUrl) {
    try {
      const u = new URL(envUrl);
      return `${u.protocol}//${u.host}`;
    } catch (_) {
      // Fallback: strip trailing /api if present
      return envUrl.replace(/\/?api\/?$/, '');
    }
  }
  if (typeof window !== 'undefined' && window.location) {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:5000`;
  }
  return 'http://localhost:5000';
}

export function buildImageUrl(relativePath) {
  if (!relativePath) return '';
  const base = getMediaBaseURL();
  return `${base}/${String(relativePath).replace(/^\//, '')}`;
}
