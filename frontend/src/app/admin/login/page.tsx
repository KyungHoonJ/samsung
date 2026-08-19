'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/lib/admin-api';

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setLoading(true);
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${API_BASE}/admin/auth/login`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: data.get('email'), password: data.get('password') }) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || '로그인하지 못했습니다.');
      router.push('/admin/consultations'); router.refresh();
    } catch (e) { setError(e instanceof Error ? e.message : '로그인 오류가 발생했습니다.'); }
    finally { setLoading(false); }
  }
  return <main className="admin-login"><form onSubmit={submit}><p className="eyebrow">Administrator</p><h1>관리자 로그인</h1><label>이메일<input name="email" type="email" autoComplete="username" required /></label><label>비밀번호<input name="password" type="password" autoComplete="current-password" minLength={10} required /></label>{error && <p className="form-error" role="alert">{error}</p>}<button className="button" disabled={loading}>{loading ? '확인 중…' : '로그인'}</button></form></main>;
}

