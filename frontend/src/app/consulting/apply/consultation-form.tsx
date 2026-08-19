'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  category: z.enum(['ARTICLES_OF_INCORPORATION', 'INHERITANCE', 'OTHER']),
  name: z.string().trim().min(2, '이름을 2자 이상 입력해 주세요.').max(30),
  phone: z.string().regex(/^01[016789]-?\d{3,4}-?\d{4}$/, '휴대전화 번호를 확인해 주세요.'),
  regionLevel1: z.string().min(1, '시·도를 선택해 주세요.'),
  regionLevel2: z.string().trim().max(50).optional(),
  preferredPlace: z.string().trim().max(100).optional(),
  preferredContactTime: z.string().max(50).optional(),
  inquiry: z.string().trim().min(20, '상담 내용을 20자 이상 입력해 주세요.').max(1000),
  privacyConsent: z.literal(true, { error: '개인정보 수집·이용 동의가 필요합니다.' }),
});

type FormValues = z.infer<typeof schema>;
const regions = ['서울특별시', '부산광역시', '대구광역시', '인천광역시', '광주광역시', '대전광역시', '울산광역시', '세종특별자치시', '경기도', '강원특별자치도', '충청북도', '충청남도', '전북특별자치도', '전라남도', '경상북도', '경상남도', '제주특별자치도'];

export function ConsultationForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { category: 'ARTICLES_OF_INCORPORATION', privacyConsent: false as true },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError('');
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api/v1'}/consultations`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, phone: values.phone.replace(/\D/g, ''), privacyConsentVersion: '2026-08-19' }),
      });
      if (!response.ok) throw new Error('상담 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.');
      const result: { publicId: string } = await response.json();
      router.push(`/consulting/complete?request=${encodeURIComponent(result.publicId)}`);
    } catch (error) { setServerError(error instanceof Error ? error.message : '오류가 발생했습니다.'); }
  };

  return (
    <form className="consultation-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <fieldset><legend>어떤 상담이 필요하신가요?</legend><div className="radio-grid">
        <label><input type="radio" value="ARTICLES_OF_INCORPORATION" {...register('category')} /><span>정관 검토·수정</span></label>
        <label><input type="radio" value="INHERITANCE" {...register('category')} /><span>상속 관련</span></label>
        <label><input type="radio" value="OTHER" {...register('category')} /><span>기타</span></label>
      </div></fieldset>
      <div className="field-row"><label>이름<input autoComplete="name" {...register('name')} /></label><label>전화번호<input type="tel" inputMode="tel" autoComplete="tel" placeholder="010-1234-5678" {...register('phone')} /></label></div>
      <ErrorText text={errors.name?.message ?? errors.phone?.message} />
      <div className="field-row"><label>상담 희망 시·도<select defaultValue="" {...register('regionLevel1')}><option value="" disabled>선택해 주세요</option>{regions.map(region => <option key={region}>{region}</option>)}</select></label><label>시·군·구 <small>선택</small><input placeholder="예: 강남구" {...register('regionLevel2')} /></label></div>
      <ErrorText text={errors.regionLevel1?.message} />
      <div className="field-row"><label>편한 지역·역 이름 <small>선택</small><input placeholder="예: 선릉역 인근" {...register('preferredPlace')} /></label><label>연락 희망 시간 <small>선택</small><select defaultValue="" {...register('preferredContactTime')}><option value="">언제든 가능</option><option>오전 9시~12시</option><option>오후 12시~3시</option><option>오후 3시~6시</option></select></label></div>
      <label>상담 내용<textarea rows={7} placeholder="현재 상황과 궁금한 점을 적어주세요. 민감한 상세정보는 전화 상담 시 확인합니다." {...register('inquiry')} /></label><ErrorText text={errors.inquiry?.message} />
      <div className="consent-box"><label className="checkbox"><input type="checkbox" {...register('privacyConsent')} /><span><b>[필수]</b> 상담 처리를 위한 개인정보 수집·이용에 동의합니다.</span></label><details><summary>수집·이용 내용 보기</summary><p>목적: 상담 신청 확인, 연락 및 일정 조율<br />항목: 이름, 전화번호, 상담 분야, 희망 지역, 상담 내용<br />보유기간: 상담 목적 달성 후 내부 보유정책에 따라 파기<br />동의를 거부할 수 있으나, 거부 시 상담 신청이 어렵습니다.</p></details></div>
      <ErrorText text={errors.privacyConsent?.message} />{serverError && <p className="form-error" role="alert">{serverError}</p>}
      <button className="button submit-button" disabled={isSubmitting}>{isSubmitting ? '접수 중…' : '상담 신청하기'}</button>
    </form>
  );
}

function ErrorText({ text }: { text?: string }) { return text ? <p className="field-error" role="alert">{text}</p> : null; }

