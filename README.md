# 컨설팅 상담 플랫폼

정관 수정·상속 컨설팅 광고 랜딩페이지와 상담 접수 API입니다.

## 구성

- `frontend`: Next.js App Router
- `backend`: NestJS + Prisma + MySQL
- 운영 환경: 단일 AWS EC2 t3.micro + Nginx + PM2

## 로컬 실행

1. MySQL에 `consulting` 데이터베이스를 생성합니다.
2. 각 앱의 `.env.example`을 `.env` 또는 `.env.local`로 복사해 값을 설정합니다.
3. 의존성과 Prisma Client를 준비합니다.

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
```

4. 터미널 두 개에서 실행합니다.

```bash
npm run dev:backend
npm run dev:frontend
```

- 웹: http://localhost:3000
- API: http://localhost:4000/api/v1
- API 문서(개발 환경): http://localhost:4000/docs

## 로컬 관리자

- 관리자 로그인: http://localhost:3000/admin/login
- 초기 계정: `backend/.env`의 `ADMIN_EMAIL`, `ADMIN_PASSWORD`
- 현재 로컬 초기값: `admin@local.test` / `Admin1234!`

운영 배포 전 초기 비밀번호를 반드시 변경하고, 애플리케이션 DB 계정도 `root`가 아닌 최소 권한 전용 계정을 사용합니다.

## 개인정보 보호

`FIELD_ENCRYPTION_KEY`는 32바이트 base64 값이어야 하고 운영 DB와 분리해 보관해야 합니다.

```bash
openssl rand -base64 32
openssl rand -hex 32
```

첫 번째 결과는 `FIELD_ENCRYPTION_KEY`, 두 번째 결과는 `SEARCH_HASH_KEY`로 사용합니다. 운영 로그에 이름, 전화번호, 상담 내용을 기록하지 않습니다.
