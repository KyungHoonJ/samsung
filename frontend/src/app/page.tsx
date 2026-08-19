import Link from 'next/link';

const services = [
  { title: '정관 검토·수정', text: '현재 정관을 검토하고 회사 상황에 맞는 조항과 후속 절차를 안내합니다.' },
  { title: '상속 관련 상담', text: '상속 절차, 사전 준비, 상속포기·한정승인 등 필요한 초기 방향을 확인합니다.' },
  { title: '기타 상담', text: '상담 분야를 판단하기 어려운 경우 내용을 확인해 적절한 담당 영역을 안내합니다.' },
];

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div>
            <p className="eyebrow">정관 수정 · 상속 컨설팅</p>
            <h1>복잡한 문제일수록<br />첫 단계는 명확하게.</h1>
            <p className="hero-copy">현재 상황을 먼저 듣고 필요한 절차와 준비 사항을 차분하게 안내해 드립니다.</p>
            <div className="actions">
              <Link className="button" href="/consulting/apply">상담 신청하기</Link>
              <a className="button button-secondary" href="#process">진행 절차 보기</a>
            </div>
            <p className="fine-print">상담 신청만으로 비용이나 계약이 발생하지 않습니다.</p>
          </div>
          <aside className="hero-card" aria-label="상담 안내">
            <span>빠른 상담 접수</span>
            <strong>정확한 주소 대신<br />편한 지역만 알려주세요.</strong>
            <p>신청 내용을 확인한 뒤 담당자가 연락하여 일정과 장소를 조율합니다.</p>
          </aside>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <p className="eyebrow">상담 분야</p><h2>필요한 부분부터 살펴봅니다</h2>
          <div className="card-grid">{services.map((service, index) => <article className="card" key={service.title}><span>0{index + 1}</span><h3>{service.title}</h3><p>{service.text}</p></article>)}</div>
        </div>
      </section>

      <section className="section section-muted" id="process">
        <div className="container">
          <p className="eyebrow">진행 절차</p><h2>신청부터 상담까지</h2>
          <ol className="steps">
            <li><b>1</b><div><strong>상담 신청</strong><p>최소한의 연락처와 상담 분야를 남깁니다.</p></div></li>
            <li><b>2</b><div><strong>담당자 확인</strong><p>신청 내용을 확인하고 전화로 연락드립니다.</p></div></li>
            <li><b>3</b><div><strong>일정 조율</strong><p>상담 방식과 편한 장소를 함께 정합니다.</p></div></li>
            <li><b>4</b><div><strong>정식 상담</strong><p>필요 자료와 후속 절차를 구체적으로 안내합니다.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="cta"><div className="container"><div><p className="eyebrow">상담이 필요하신가요?</p><h2>현재 상황부터 알려주세요.</h2></div><Link className="button button-light" href="/consulting/apply">상담 신청하기</Link></div></section>
    </main>
  );
}

