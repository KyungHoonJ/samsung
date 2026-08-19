'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { AdminNav } from '@/components/admin-nav';
import { adminFetch } from '@/lib/admin-api';

type Consultation = { id: string; publicId: string; category: string; name: string; phoneMasked: string; region: string; status: string; createdAt: string };
type ListResponse = { items: Consultation[]; total: number; page: number; limit: number };
const categoryLabel: Record<string, string> = { ARTICLES_OF_INCORPORATION: '정관 수정', INHERITANCE: '상속', OTHER: '기타' };
const statusLabel: Record<string, string> = { NEW: '신규', CONTACT_SCHEDULED: '연락 예정', CONTACTED: '연락 완료', APPOINTMENT_BOOKED: '상담 예약', COMPLETED: '상담 완료', CONTRACT_IN_PROGRESS: '계약 진행', CLOSED: '종결', UNREACHABLE: '연락 불가', PENDING_DELETION: '삭제 예정' };

export default function ConsultationsPage() {
  const [data, setData] = useState<ListResponse>(); const [error, setError] = useState(''); const [query, setQuery] = useState(''); const [status, setStatus] = useState('');
  const load = useCallback(async () => { try { setError(''); const params = new URLSearchParams(); if (query) params.set('search', query); if (status) params.set('status', status); setData(await adminFetch(`/admin/consultations?${params}`)); } catch (e) { setError(e instanceof Error ? e.message : '조회 오류'); } }, [query, status]);
  useEffect(() => { void load(); }, [load]);
  function search(e: FormEvent) { e.preventDefault(); void load(); }
  return <><AdminNav /><main className="admin-main container"><div className="admin-title"><div><p className="eyebrow">Consultations</p><h1>상담 관리</h1></div><strong>전체 {data?.total ?? 0}건</strong></div><form className="admin-filters" onSubmit={search}><input aria-label="검색" placeholder="신청번호 또는 전화번호" value={query} onChange={e => setQuery(e.target.value)} /><select aria-label="상태" value={status} onChange={e => setStatus(e.target.value)}><option value="">전체 상태</option>{Object.entries(statusLabel).map(([key, value]) => <option value={key} key={key}>{value}</option>)}</select><button className="button button-small">조회</button></form>{error && <p className="form-error">{error}</p>}<div className="admin-table-wrap"><table className="admin-table"><thead><tr><th>접수일</th><th>신청번호</th><th>분야</th><th>신청자</th><th>전화번호</th><th>지역</th><th>상태</th></tr></thead><tbody>{data?.items.map(item => <tr key={item.id}><td>{new Date(item.createdAt).toLocaleDateString('ko-KR')}</td><td><Link href={`/admin/consultations/${item.id}`}>{item.publicId}</Link></td><td>{categoryLabel[item.category]}</td><td>{item.name}</td><td>{item.phoneMasked}</td><td>{item.region}</td><td><span className={`status status-${item.status.toLowerCase()}`}>{statusLabel[item.status]}</span></td></tr>)}{data?.items.length === 0 && <tr><td colSpan={7} className="empty">접수된 상담이 없습니다.</td></tr>}</tbody></table></div></main></>;
}
