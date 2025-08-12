# 🚀 My Serverless App

Vercel Functions와 Supabase를 사용한 React 기반 서버리스 애플리케이션

## ✨ 주요 기능
- 🔐 Supabase 데이터베이스 연동
- 👤 로그인 시스템 (lego_user 테이블 사용)  
- ⚡ Vercel Functions를 통한 서버리스 API
- 🎨 반응형 UI 디자인

## 🛠️ 기술 스택
- **Frontend**: React, Next.js 14
- **Backend**: Vercel Functions (서버리스)
- **Database**: Supabase
- **Deployment**: Vercel
- **Version Control**: Git, GitHub

## 📦 설치 및 실행

1. **저장소 클론**
```bash
git clone https://github.com/woogi8/my_serverless_app.git
cd my_serverless_app
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정** (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

4. **개발 서버 실행**
```bash
npm run dev
```

## 🌐 배포

### Vercel 배포
1. Vercel 계정에 GitHub 리포지토리 연결
2. 환경 변수 설정
3. 자동 배포 완료

### 환경 변수 (Vercel 대시보드)
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase 프로젝트 URL
- `SUPABASE_SERVICE_ROLE_KEY`: Supabase 서비스 롤 키

## 📚 API 엔드포인트

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | 사용자 로그인 |

## 🔧 프로젝트 구조

```
├── pages/
│   ├── api/auth/          # API 엔드포인트
│   ├── index.js          # 메인 페이지
│   ├── login.js          # 로그인 페이지
│   └── _app.js
├── package.json
├── next.config.js
└── README.md
```

## 📝 사용 방법

1. **로그인**: `/login` 페이지에서 사용자 인증
2. **메인 화면**: 로그인 성공 시 "HELLO VIBECODE" 메시지 표시
3. **로그아웃**: 메인 화면에서 로그아웃 가능

---

🤖 **Generated with Claude Code** | 📧 Contact: woogi8@example.com