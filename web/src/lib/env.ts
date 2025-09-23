export function isLocalhost(): boolean {
  if (typeof window === "undefined") return process.env.NODE_ENV === "development";
  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1" || host === "::1") return true;
  return process.env.NODE_ENV === "development";
}

export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

export function isProd(): boolean {
  return process.env.NODE_ENV === "production";
}


