export const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"
).replace(/\/+$/, "");

export const API_URL = `${BACKEND_URL}/api`;

export const WEBSOCKET_URL =
  `${BACKEND_URL.replace(/^http/, "ws")}/ws`;

export const backendAssetUrl = (path) => {
  if (!path) return "";

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${BACKEND_URL}${path.startsWith("/") ? path : `/${path}`}`;
};