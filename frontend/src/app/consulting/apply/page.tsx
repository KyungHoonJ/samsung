import { ConsultationForm } from './consultation-form';

export default function ApplyPage() {
  return <main className="form-page"><div className="container narrow"><p className="eyebrow">상담 신청</p><h1>편하게 말씀해 주세요</h1><p className="page-intro">정확한 집 주소나 주민등록번호, 계좌번호, 상세 재산내역은 입력하지 마세요.</p><ConsultationForm /></div></main>;
}

