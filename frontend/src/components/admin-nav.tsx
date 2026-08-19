'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { adminFetch } from '@/lib/admin-api';

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const links = [['/admin/consultations', '상담 관리'], ['/admin/users', '관리자'], ['/admin/audit-logs', '감사 로그']];
  return <div className="admin-nav"><div className="container admin-nav-inner"><strong>관리자 센터</strong><nav>{links.map(([href, label]) => <Link className={pathname.startsWith(href) ? 'active' : ''} href={href} key={href}>{label}</Link>)}<button onClick={async () => { await adminFetch('/admin/auth/logout', { method: 'POST' }); router.push('/admin/login'); }}>로그아웃</button></nav></div></div>;
}

