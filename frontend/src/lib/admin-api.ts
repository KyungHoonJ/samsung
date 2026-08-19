export const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1';

export async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (response.status === 401) {
    if (typeof window !== 'undefined') window.location.href = '/admin/login';
    throw new Error('로그인이 필요합니다.');
  }
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const message = Array.isArray(body.message) ? body.message.join(', ') : body.message;
    throw new Error(message || '요청을 처리하지 못했습니다.');
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

