import type { Metadata } from 'next';
import { SiteChrome } from '@/components/site-chrome';
import './globals.css';
import './admin.css';

export const metadata: Metadata = {
  title: '바른 컨설팅 | 정관 수정·상속 상담',
  description: '정관 검토와 수정, 상속 절차와 사전 준비를 상담합니다.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
