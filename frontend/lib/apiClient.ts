"use client";

import { useAuth } from '../components/AuthProvider';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

export function useApiClient() {
  const { getToken } = useAuth();

  async function request<T>(
    path: string,
    options: RequestInit = {},
    authRequired = false,
  ): Promise<T> {
    const url = `${API_BASE_URL}${path}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };

    if (authRequired) {
      const token = await getToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Request failed with status ${res.status}`);
    }

    return res.json() as Promise<T>;
  }

  return {
    get: <T,>(path: string, authRequired = false) =>
      request<T>(path, { method: 'GET' }, authRequired),
    post: <T,>(path: string, body: unknown, authRequired = false) =>
      request<T>(
        path,
        { method: 'POST', body: JSON.stringify(body) },
        authRequired,
      ),
  };
}

