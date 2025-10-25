import type { RunSnapshot } from "../types";

const BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

function ok(res: Response) {
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Authentication required. Please log in.");
    }
    throw new Error(`Request failed: ${res.status}`);
  }
  return res.json();
}

interface ApiOptions {
  authToken?: string | null;
}

async function apiRequest(endpoint: string, options: RequestInit & ApiOptions = {}) {
  const { authToken, ...fetchOptions } = options;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {})
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const res = await fetch(`${BASE}${endpoint}`, {
    ...fetchOptions,
    headers
  });
  
  return ok(res);
}

export async function startRun(userId: string, profileText?: string, authToken?: string | null) {
  return apiRequest('/trigger', {
    method: "POST",
    body: JSON.stringify({ userId, profileText }),
    authToken
  }) as Promise<{ runId: string }>;
}

export async function getStatus(userId: string, runId?: string, authToken?: string | null) {
  const params = runId ? `?runId=${encodeURIComponent(runId)}` : '';
  return apiRequest(`/status/${encodeURIComponent(userId)}${params}`, {
    method: "GET",
    authToken
  }) as Promise<RunSnapshot>;
}