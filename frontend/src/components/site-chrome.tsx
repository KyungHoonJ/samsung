'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return <>{children}</>;
  return <>
    <header className="site-header"><div className="container header-inner"><Link className="brand" href="/">바른 컨설팅</Link><nav aria-label="주요 메뉴"><a href="/#services">상담 분야</a><a href="/#process">진행 절차</a><Link className="button button-small" href="/consulting/apply">상담 신청</Link></nav></div></header>
    {children}
    <footer><div className="container footer-inner"><div><strong>바른 컨설팅</strong><p>사업자 및 담당자 정보는 운영 주체 확정 후 표시합니다.</p></div><div><Link href="/privacy">개인정보 처리방침</Link></div></div></footer>
  </>;
}
