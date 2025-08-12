# My Serverless App

Vercel Functions와 Supabase를 사용한 React 기반 서버리스 애플리케이션

## 기능
- Supabase 데이터베이스 연동
- 로그인 시스템 (lego_user 테이블 사용)
- Vercel Functions를 통한 서버리스 API

## 설정

1. 환경 변수 설정 (.env.local):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

2. 의존성 설치:
```bash
npm install
```

3. 개발 서버 실행:
```bash
npm run dev
```

## 배포

Vercel에 자동 배포됩니다:
- GitHub 리포지토리: https://github.com/woogi8/my_serverless_app
- 환경 변수는 Vercel 대시보드에서 설정

## API 엔드포인트

- `POST /api/auth/login` - 사용자 로그인