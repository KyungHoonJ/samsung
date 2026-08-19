# 정관 수정·상속 컨설팅 플랫폼 설계서

> 작성 기준일: 2026-08-19  
> 문서 상태: MVP 개발 기준  
> 기술 구성: Next.js + NestJS + MySQL + Prisma  
> 배포 대상: AWS EC2 `t3.micro` 단일 서버

## 1. 프로젝트 개요

정관 수정과 상속 관련 컨설팅을 소개하고 상담 신청을 접수하는 광고·상담 플랫폼을 구축한다.

서비스의 핵심 목표는 다음과 같다.

- 광고로 유입된 방문자에게 상담 분야와 진행 절차를 명확히 설명한다.
- 상담에 필요한 최소한의 개인정보만 수집한다.
- 신청 내용을 관리자에게 안전하게 전달한다.
- 개인정보의 조회, 처리, 보관 및 파기 이력을 관리한다.
- AWS EC2 프리 티어 수준의 소형 서버에서도 운영할 수 있도록 구성한다.

주요 상담 분야는 다음과 같다.

- 법인 정관 검토 및 수정
- 상속 절차 및 사전 준비
- 상속포기·한정승인 관련 초기 상담
- 기타 기업·가업 관련 상담

## 2. 핵심 사용자 흐름

```text
광고 또는 검색 유입
  → 랜딩페이지에서 상담 분야 확인
  → 상담 신청 화면 이동
  → 최소 정보 및 개인정보 동의 입력
  → 상담 신청 완료
  → 담당자가 신청 확인
  → 전화 연락
  → 일정·장소 조율
  → 정식 상담
```

상담 신청만으로 비용이나 계약이 발생하지 않는다는 점을 명시한다. 무료 상담 여부가 확정되지 않았다면 `무료 상담`이라는 표현은 사용하지 않는다.

## 3. 개인정보 수집 원칙

### 3.1 수집 항목

| 항목 | 필수 여부 | 용도 |
|---|---|---|
| 상담 분야 | 필수 | 담당 분야 분류 |
| 이름 | 필수 | 신청자 식별 및 연락 |
| 전화번호 | 필수 | 상담 연락 |
| 상담 희망 시·도 | 필수 | 상담 가능 지역 확인 |
| 시·군·구 | 선택 | 상담 지역 조율 |
| 편한 지역·역 이름 | 선택 | 만남 장소 조율 |
| 연락 희망 시간 | 선택 | 전화 일정 조율 |
| 상담 내용 | 필수 | 초기 상담 방향 파악 |
| 개인정보 수집·이용 동의 | 필수 | 상담 처리를 위한 동의 증적 |

### 3.2 주소 수집 방식

최초 신청 단계에서는 정확한 도로명 주소나 상세 집 주소를 받지 않는다. 다음 수준으로만 수집한다.

- 시·도
- 시·군·구
- 희망 지역 또는 역 이름

예시는 `서울 강남구`, `수원역 인근`, `부산 해운대구` 등이다. 실제 만남 장소는 전화 상담 후 확정한다.

### 3.3 상담 내용 입력 주의

상담 내용에는 가족관계, 재산, 채무 등 민감할 수 있는 내용이 포함될 가능성이 있다. 입력 화면에 다음 정보를 작성하지 말라는 안내를 제공한다.

- 주민등록번호
- 계좌번호
- 정확한 집 주소
- 상세 재산내역
- 기타 상담 접수에 불필요한 민감정보

### 3.4 동의 화면

필수 동의와 선택 동의를 구분하고 사전 체크하지 않는다. 필수 수집 동의에는 다음 내용을 표시한다.

- 수집·이용 목적
- 수집 항목
- 보유 및 이용 기간
- 동의를 거부할 권리
- 동의 거부 시 상담 신청이 어렵다는 내용

마케팅 메시지를 실제로 발송하지 않는 MVP 단계에서는 마케팅 수신 동의를 받지 않는다.

### 3.5 보유 및 파기

현재 개발 기본값은 접수 후 180일이다. 실제 운영 전에는 운영 주체와 계약 전환 여부를 기준으로 보유기간을 확정해야 한다.

- 보유기간이 지난 상담 신청은 매일 새벽 자동 파기한다.
- 처리 목적이 조기에 달성되어 정보가 불필요해진 경우에도 파기할 수 있어야 한다.
- 다른 법령에 따라 보존해야 하는 정보는 운영 데이터와 분리한다.
- 개인정보 처리방침은 운영 주체, 개인정보 보호책임자, 위탁사 및 확정 보유기간을 반영해 최종 검토 후 게시한다.

## 4. 사용자 화면 구성

### 4.1 공통 헤더

- 서비스명 또는 로고
- 상담 분야 이동 링크
- 진행 절차 이동 링크
- 상담 신청 CTA
- 모바일에서는 메뉴를 축소하고 상담 신청 버튼을 우선 노출

### 4.2 메인 랜딩페이지

#### 히어로 영역

- 정관 수정·상속 컨설팅이라는 서비스 성격을 즉시 전달한다.
- 핵심 문구와 상담 신청 버튼을 배치한다.
- 상담 신청만으로 비용이나 계약이 발생하지 않는다는 안내를 표시한다.
- 정확한 주소 대신 편한 지역만 입력해도 된다는 점을 알린다.

#### 상담 분야

1. 정관 검토·수정
   - 현재 정관 검토
   - 변경이 필요한 조항 확인
   - 회사 상황에 맞는 수정 방향 상담
   - 주주총회·등기 등 후속 절차 안내

2. 상속 관련 상담
   - 상속 절차의 전체 흐름
   - 상속재산과 채무 확인 방향
   - 상속포기·한정승인 관련 초기 상담
   - 가족 및 가업 승계 관련 상담

3. 기타 상담
   - 분야를 판단하기 어려운 신청 접수
   - 신청 확인 후 적절한 상담 영역 안내

#### 진행 절차

```text
1. 상담 신청
2. 담당자 확인 및 전화 연락
3. 상담 일정과 장소 조율
4. 정식 상담
5. 필요한 경우 계약 및 후속 업무 진행
```

#### 신뢰 요소

운영 주체가 확정되면 실제로 증명할 수 있는 내용만 표시한다.

- 담당자 경력
- 자격 및 등록 정보
- 협력 전문가
- 사무실 위치
- 사업자 정보
- 동의를 받은 실제 고객 후기

과장된 성공 보장, 절세 보장, 분쟁 해결 보장 표현은 사용하지 않는다. 법률·세무 등 전문 자격이 필요한 업무는 실제 제공 주체와 역할을 명확히 구분한다.

#### 푸터

- 상호 및 대표자
- 사업자등록번호
- 주소 및 대표 연락처
- 개인정보 처리방침
- 이용약관
- 자격 및 제휴 관계 안내

### 4.3 상담 신청 화면

입력 순서는 다음과 같다.

1. 상담 분야
2. 이름과 전화번호
3. 상담 희망 시·도 및 시·군·구
4. 편한 지역 또는 역 이름
5. 연락 희망 시간
6. 상담 내용
7. 개인정보 수집·이용 동의
8. 상담 신청 버튼

프런트엔드와 백엔드에서 입력값을 각각 검증한다. 상담 내용은 20~1,000자, 이름은 2~30자로 제한한다.

### 4.4 접수 완료 화면

- 상담 신청 완료 메시지
- 담당자가 전화로 연락한다는 안내
- 개인정보를 포함하지 않는 공개 신청번호
- 메인으로 돌아가기 버튼

완료 화면에는 이름, 전화번호 및 상담 내용을 다시 노출하지 않는다.

### 4.5 개인정보 처리방침

개발 단계에서는 초안을 제공한다. 운영 전 다음 정보를 확정해야 한다.

- 개인정보처리자 및 운영 주체
- 개인정보 보호책임자와 연락처
- 수집 목적과 항목
- 실제 보유기간
- 파기 절차와 방법
- 업무 위탁사
- 국외 이전 여부
- 정보주체의 열람·정정·삭제·처리정지 요청 방법
- 안전성 확보조치

## 5. 관리자 화면 계획

관리자 기능은 현재 MVP에 구현되어 있다.

### 5.1 경로

```text
/admin/login
/admin/consultations
/admin/consultations/:id
/admin/users
/admin/audit-logs
```

### 5.2 상담 목록

- 신청번호
- 신청 일시
- 상담 분야
- 이름
- 마스킹된 전화번호
- 희망 지역
- 연락 희망 시간
- 처리 상태
- 담당자

필터는 접수 기간, 상담 분야, 상태, 담당자 및 희망 지역을 제공한다.

### 5.3 처리 상태

```text
신규
연락 예정
연락 완료
상담 예약
상담 완료
계약 진행
종결
연락 불가
삭제 예정
```

### 5.4 상담 상세

- 신청 정보
- 개인정보 동의 버전과 동의 시각
- 상태 변경
- 담당자 배정
- 내부 메모
- 연락 이력
- 상담 예약 일시
- 개인정보 삭제 예정일
- 변경 이력

### 5.5 관리자 보안

- 역할 기반 접근제어
- 짧은 Access Token 또는 서버 세션
- HttpOnly, Secure, SameSite 쿠키
- Refresh Token 해시 저장
- OTP 기반 2단계 인증
- 반복 로그인 실패 제한
- 장시간 미사용 시 자동 로그아웃
- 전화번호 전체 보기와 개인정보 상세 조회 감사 로그

## 6. 기술 구성

| 영역 | 기술 |
|---|---|
| 프런트엔드 | Next.js App Router, React, TypeScript |
| 스타일 | CSS 기반 반응형 UI |
| 폼 | React Hook Form, Zod |
| 백엔드 | NestJS, TypeScript |
| 유효성 검사 | class-validator, class-transformer |
| 데이터베이스 | MySQL 8 |
| ORM | Prisma 6 |
| 스케줄링 | `@nestjs/schedule` |
| API 문서 | Swagger/OpenAPI, 개발 환경에서만 노출 |
| 웹 서버 | Nginx |
| 프로세스 관리 | PM2 |
| TLS | Let's Encrypt, Certbot |
| 배포 서버 | AWS EC2 `t3.micro` |

Docker, Redis, BullMQ, RDS, ALB, NAT Gateway 및 Kubernetes는 현재 MVP 범위에서 사용하지 않는다.

## 7. 저장소 구조

```text
consulting-platform/
├─ frontend/                  # Next.js
│  ├─ src/app/
│  │  ├─ page.tsx            # 랜딩페이지
│  │  ├─ consulting/
│  │  │  ├─ apply/           # 상담 신청
│  │  │  └─ complete/        # 접수 완료
│  │  └─ privacy/            # 개인정보 처리방침
│  ├─ next.config.ts
│  └─ package.json
│
├─ backend/                   # NestJS
│  ├─ prisma/
│  │  └─ schema.prisma
│  ├─ src/
│  │  ├─ consultations/      # 상담 접수
│  │  ├─ encryption/         # 개인정보 암호화
│  │  ├─ prisma/             # DB 연결
│  │  ├─ app.module.ts
│  │  ├─ health.controller.ts
│  │  └─ main.ts
│  └─ package.json
│
├─ docs/
│  └─ PROJECT_PLAN.md
├─ package.json
└─ README.md
```

복잡한 모노레포 도구는 사용하지 않고 npm workspaces만 사용한다.

## 8. 백엔드 모듈 설계

### 8.1 현재 구현 모듈

- `ConsultationsModule`: 상담 접수 및 만료 데이터 파기
- `EncryptionService`: 개인정보 암호화·복호화와 검색용 해시
- `PrismaModule`: MySQL 연결
- `HealthController`: 서버 상태 확인

### 8.2 예정 모듈

- `AuthModule`: 관리자 로그인, 토큰 갱신, OTP
- `AdminModule`: 관리자 계정과 권한
- `ConsentModule`: 동의 문서 버전 관리
- `NotificationModule`: 신규 상담 문자·이메일 알림
- `AuditLogModule`: 개인정보 조회 및 변경 이력
- `RetentionModule`: 보유기간 정책 및 파기 이력 확장

## 9. API 설계

### 9.1 현재 공개 API

```http
POST /api/v1/consultations
GET  /api/v1/health
```

개발 환경 API 문서:

```text
http://localhost:4000/docs
```

상담 신청 요청 예시:

```json
{
  "category": "INHERITANCE",
  "name": "홍길동",
  "phone": "01012345678",
  "regionLevel1": "서울특별시",
  "regionLevel2": "강남구",
  "preferredPlace": "선릉역 인근",
  "preferredContactTime": "오후 3시~6시",
  "inquiry": "상속 절차와 필요한 준비 서류에 관해 상담받고 싶습니다.",
  "privacyConsent": true,
  "privacyConsentVersion": "2026-08-19"
}
```

응답 예시:

```json
{
  "publicId": "C-20260819-123456",
  "status": "RECEIVED",
  "message": "상담 신청이 접수되었습니다."
}
```

응답에 접수자의 개인정보를 포함하지 않는다.

### 9.2 예정 관리자 API

```http
POST   /api/v1/admin/auth/login
POST   /api/v1/admin/auth/refresh
POST   /api/v1/admin/auth/logout

GET    /api/v1/admin/consultations
GET    /api/v1/admin/consultations/:id
PATCH  /api/v1/admin/consultations/:id/status
PATCH  /api/v1/admin/consultations/:id/assignee
POST   /api/v1/admin/consultations/:id/notes
POST   /api/v1/admin/consultations/:id/contact-history
DELETE /api/v1/admin/consultations/:id

GET    /api/v1/admin/audit-logs
```

## 10. 데이터 모델

### 10.1 현재 상담 테이블

`Consultation` 모델은 다음 정보를 저장한다.

- 내부 UUID
- 공개 신청번호
- 상담 분야
- 암호화된 이름
- 암호화된 전화번호
- 전화번호 검색용 HMAC 해시
- 희망 지역
- 연락 희망 시간
- 암호화된 상담 내용
- 처리 상태
- 개인정보 동의 문서 버전 및 동의 일시
- 파기 예정일
- 생성·수정·삭제 일시

### 10.2 상태 Enum

```text
NEW
CONTACT_SCHEDULED
CONTACTED
APPOINTMENT_BOOKED
COMPLETED
CONTRACT_IN_PROGRESS
CLOSED
UNREACHABLE
PENDING_DELETION
```

### 10.3 예정 테이블

- `Admin`: 관리자 계정과 권한
- `AdminSession`: Refresh Token 해시 및 세션 만료
- `ConsultationNote`: 암호화된 관리자 메모
- `ContactHistory`: 전화·문자·이메일·미팅 이력
- `ConsentDocument`: 개인정보 동의 문서 버전
- `AuditLog`: 개인정보 접근과 변경 기록
- `NotificationJob`: 알림 발송과 재시도 상태

## 11. 개인정보 암호화

개인정보 원문은 애플리케이션 계층에서 AES-256-GCM 방식으로 암호화한다.

암호화 대상:

- 이름
- 전화번호
- 상담 내용
- 향후 관리자 내부 메모

전화번호 검색은 원문 검색 대신 정규화한 전화번호의 HMAC-SHA256 값을 사용한다.

환경변수:

```env
FIELD_ENCRYPTION_KEY=32바이트_base64_키
SEARCH_HASH_KEY=검색용_긴_무작위_비밀값
```

키 생성 예시:

```bash
openssl rand -base64 32
openssl rand -hex 32
```

암호화 키는 DB, Git 저장소 및 애플리케이션 로그와 분리해 관리한다.

## 12. 애플리케이션 보안

- 모든 외부 통신에 HTTPS 적용
- DTO 화이트리스트와 허용되지 않은 필드 차단
- 상담 접수 API 분당 3회 제한
- 전체 API 기본 요청 제한
- Helmet 보안 헤더 적용
- 운영 환경에서 Swagger 비활성화
- MySQL을 외부에 공개하지 않음
- 운영 로그에 이름, 전화번호, 상담 내용 기록 금지
- 관리자 개인정보 조회 및 다운로드 감사 로그
- CSRF, XSS, SQL Injection 방어
- 비밀번호는 Argon2id 또는 bcrypt 해시 사용
- 관리자 2단계 인증 적용
- CAPTCHA 또는 봇 탐지는 광고 트래픽 증가 시 추가

현재 메모리 기반 요청 제한은 NestJS 인스턴스가 하나일 때 적합하다. 서버를 여러 대로 확장할 때 Redis 기반 분산 제한을 도입한다.

## 13. AWS EC2 배포 설계

### 13.1 인스턴스 전제

`t3.micro`는 2 vCPU, 1GiB 메모리의 버스트형 인스턴스다. Next.js, NestJS, MySQL을 한 서버에서 실행할 수 있으나 메모리 관리가 중요하다.

AWS 프리 티어는 계정 생성일과 플랜에 따라 기간 및 크레딧 조건이 다르므로 EC2 생성 화면의 `Free tier eligible` 표시와 Billing 정보를 반드시 확인한다.

### 13.2 서버 구성

```text
인터넷
  │
  ▼
AWS EC2 t3.micro
├─ Nginx                   :80, :443
│  ├─ /                    → Next.js :3000
│  └─ /api                 → NestJS  :4000
├─ Next.js                 127.0.0.1:3000
├─ NestJS                  127.0.0.1:4000
├─ MySQL 8                 127.0.0.1:3306
├─ PM2
└─ 2GiB Swap
```

외부에는 HTTP와 HTTPS만 공개하고 SSH는 관리자 IP로 제한한다.

### 13.3 보안 그룹

| 포트 | 출처 | 용도 |
|---|---|---|
| 80 | 전체 | HTTPS 리다이렉트 |
| 443 | 전체 | 서비스 접속 |
| 22 | 관리자 고정 IP | 서버 관리 |

3000, 4000, 3306 포트는 공개하지 않는다.

### 13.4 메모리 목표

| 프로세스 | 목표 메모리 |
|---|---:|
| 운영체제 및 기본 서비스 | 150~250MB |
| Nginx | 10~30MB |
| Next.js | 150~250MB |
| NestJS | 120~220MB |
| MySQL | 200~300MB |

2GiB Swap을 설정해 순간적인 메모리 부족으로 프로세스가 종료되는 것을 완화한다. 지속적인 Swap 사용은 인스턴스 확장이 필요하다는 신호다.

### 13.5 Next.js 운영 최적화

- `output: 'standalone'` 사용
- 공개 페이지를 정적 생성
- 운영 EC2에서 Next.js 빌드를 수행하지 않음
- 로컬 또는 CI에서 빌드한 결과만 배포
- Next.js와 NestJS를 각각 단일 프로세스로 실행

현재 공개 랜딩, 상담 신청 및 개인정보 처리방침은 정적 생성되며 접수 완료 화면만 요청 시 렌더링된다.

### 13.6 MySQL 경량 설정 예시

```ini
[mysqld]
bind-address = 127.0.0.1
character-set-server = utf8mb4
collation-server = utf8mb4_0900_ai_ci

innodb_buffer_pool_size = 192M
innodb_log_buffer_size = 16M
max_connections = 30
thread_cache_size = 8
table_open_cache = 256
performance_schema = OFF

slow_query_log = ON
long_query_time = 1
```

Prisma 연결 수도 제한한다.

```env
DATABASE_URL=mysql://consulting_app:password@127.0.0.1:3306/consulting?connection_limit=5&pool_timeout=10
```

### 13.7 PM2 운영 방향

- Next.js 1개 프로세스
- NestJS 1개 프로세스
- Cluster Mode 미사용
- 메모리 한도 초과 시 재시작
- `pm2-logrotate` 또는 OS `logrotate` 적용
- 서버 재부팅 시 자동 시작

### 13.8 빌드 및 배포 흐름

```text
Git push
  → GitHub Actions 또는 개발 PC에서 의존성 설치
  → Prisma Client 생성
  → Next.js 프로덕션 빌드
  → NestJS 프로덕션 빌드
  → 빌드 산출물을 EC2에 업로드
  → 필요한 DB 마이그레이션 실행
  → PM2 무중단 재시작
  → Health API 확인
```

운영 서버에서 `npm install`, `next build` 등 메모리를 많이 사용하는 작업을 최소화한다.

### 13.9 백업

동일 EBS 내부 백업만으로는 볼륨 장애에 대응할 수 없다.

```text
매일 새벽 mysqldump
  → 압축
  → 외부 키로 암호화
  → 비공개 S3 버킷 전송
  → 로컬 백업 삭제
  → S3 Lifecycle로 만료 백업 삭제
```

권장 초기 정책:

- 일별 백업 7일
- 주별 백업 4주
- 월 1회 복원 테스트

S3, EBS, 데이터 전송, 공인 IPv4 및 백업 스냅샷에는 프리 티어와 별도의 소액 비용이 발생할 수 있다.

### 13.10 비용 관리

- Free Tier 사용량 알림 활성화
- AWS Budgets에 `$1`, `$5`, `$10` 알림 설정
- EC2 인스턴스 1대만 유지
- 미사용 Elastic IP 즉시 반환
- 사용하지 않는 EBS 볼륨과 스냅샷 삭제
- NAT Gateway와 ALB를 생성하지 않음
- CloudWatch 상세 모니터링은 초기 비활성화
- `CPUCreditBalance`, 메모리, Swap, 디스크 사용량 확인
- T3 Unlimited 모드의 추가 CPU 크레딧 과금 가능성 확인

## 14. Redis를 사용하지 않는 이유

초기에는 NestJS 인스턴스가 하나이고 상담 접수량도 많지 않을 것으로 예상한다.

| 원래 Redis 용도 | 현재 대안 |
|---|---|
| 요청 제한 | NestJS 메모리 기반 Throttler |
| 로그인 실패 제한 | MySQL 관리자·세션 테이블 |
| 비동기 알림 | MySQL `NotificationJob` + 스케줄러 |
| 관리자 세션 | MySQL에 Refresh Token 해시 저장 |
| 자동 파기 | NestJS Schedule + MySQL |

다음 조건이 발생하면 Redis를 검토한다.

- NestJS 서버를 여러 대 운영
- 분산 환경에서 정확한 요청 제한 필요
- 문자·이메일 발송량 증가
- 알림 순서와 재시도가 중요해짐
- 복잡한 작업 큐가 필요해짐

## 15. 로컬 개발 환경

필수 조건:

- Node.js 20.9 이상
- npm
- MySQL 8

환경설정:

```bash
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
```

MySQL 데이터베이스 생성 예시:

```sql
CREATE DATABASE consulting
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;
```

설치 및 마이그레이션:

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
```

개발 서버 실행:

```bash
npm run dev:backend
npm run dev:frontend
```

접속 주소:

- Next.js: `http://localhost:3000`
- NestJS: `http://localhost:4000/api/v1`
- Swagger: `http://localhost:4000/docs`

검증:

```bash
npm run lint
npm run build
```

## 16. 현재 구현 현황

### 완료

- npm workspaces 기반 프런트엔드·백엔드 구조
- 반응형 랜딩페이지
- 상담 분야 및 진행 절차
- 상담 신청 폼
- Zod 기반 브라우저 입력 검증
- class-validator 기반 API 입력 검증
- 상담 신청 완료 화면과 공개 신청번호
- 개인정보 처리방침 개발 초안
- NestJS 상담 접수 API
- MySQL Prisma 모델
- AES-256-GCM 개인정보 암호화
- 전화번호 검색용 HMAC-SHA256
- API 요청 제한
- Helmet 보안 헤더
- CORS 설정
- 매일 새벽 만료 상담 자동 파기
- 개발 환경 Swagger
- Next.js standalone 빌드
- 프런트엔드·백엔드 타입 검사 및 프로덕션 빌드 확인

### 미구현

- OTP 2단계 인증
- 상담 담당자 배정
- 동의 문서 DB 버전 관리
- 문자·이메일 알림과 재시도
- 열람·정정·삭제 요청 처리 화면
- Nginx, PM2, Certbot 실제 서버 설정
- GitHub Actions 배포 파이프라인
- S3 암호화 백업
- 운영 모니터링과 장애 알림

## 17. 개발 우선순위

### 1단계: 공개 상담 접수 완성

- 실제 MySQL 마이그레이션
- API 통합 테스트
- 실제 운영 정보와 개인정보 처리방침 반영
- 오류 화면과 404 화면 개선
- 광고 유입 UTM 저장

### 2단계: 관리자 기능

- 관리자 계정과 권한
- 로그인·Refresh Token·OTP
- 상담 목록·검색·필터
- 개인정보 마스킹과 권한별 원문 조회
- 상담 상세·상태·메모·연락 이력
- 감사 로그

### 3단계: 알림과 운영

- 신규 상담 알림
- MySQL 기반 알림 재시도
- 개인정보 열람·삭제 요청 처리
- 자동 백업과 복원 검증
- EC2 배포 자동화
- 모니터링과 비용 알림

### 4단계: 확장

- 상담 예약 캘린더
- 광고 채널별 전환 통계
- 관리자 대시보드
- 서버 메모리 상향 또는 DB 분리
- 필요 시 Redis와 작업 큐 도입

## 18. 운영 전 확인사항

- 운영 상호, 대표자, 사업자등록번호 및 연락처
- 컨설팅 제공자의 실제 자격과 업무 범위
- 제휴 전문가의 역할 및 개인정보 제공 여부
- 상담 비용과 계약 발생 시점
- 개인정보의 최종 보유기간
- 개인정보 보호책임자
- 문자·이메일 발송 업체와 위탁 계약
- 광고·분석 도구 및 쿠키 사용 여부
- 국외 이전 여부
- 개인정보 처리방침 법률 검토
- 도메인, SSL, AWS 리전 및 프리 티어 적용 상태

## 19. 참고 자료

- [개인정보 처리방침 작성지침(2025.4), 개인정보 포털](https://www.privacy.go.kr/front/bbs/bbsView.do?bbsNo=BBSMSTR_000000000049&bbscttNo=20806)
- [개인정보 보호법 시행령 제17조 동의를 받는 방법, 국가법령정보센터](https://www.law.go.kr/lumLsLinkPop.do?lspttninfSeq=143411)
- [AWS EC2 프리 티어 사용량 안내](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-free-tier-usage.html)
- [AWS EC2 T3 인스턴스 사양](https://aws.amazon.com/ec2/instance-types/general-purpose/)
- [AWS Public IPv4 요금](https://aws.amazon.com/vpc/pricing/)
- [AWS T3 Unlimited 모드](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/burstable-performance-instances-unlimited-mode-concepts.html)

---

이 문서는 현재 개발 기준을 정리한 설계서다. 개인정보 처리방침, 보유기간, 광고 문구와 전문 자격 관련 표현은 실제 운영 주체가 확정된 후 법률 검토를 거쳐 최종 확정한다.
