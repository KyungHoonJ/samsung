import Link from 'next/link';

export default async function CompletePage({ searchParams }: { searchParams: Promise<{ request?: string }> }) {
  const { request } = await searchParams;
  return <main className="form-page"><div className="container narrow success-card"><div className="success-mark">✓</div><p className="eyebrow">접수 완료</p><h1>상담 신청이 접수되었습니다.</h1><p>담당자가 내용을 확인한 후 입력하신 전화번호로 연락드리겠습니다.</p>{request && <p className="request-id">신청번호 <strong>{request}</strong></p>}<Link className="button" href="/">메인으로 돌아가기</Link></div></main>;
}

