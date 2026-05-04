# Re:Link AI Mobile MVP Frontend

Re:Link AI의 발표용 모바일 프론트 MVP입니다. 현재 정적 MVP의 디자인을 기준선으로 유지하면서, 이후 프론트/백엔드 분리 개발을 시작할 수 있도록 최소 개발 하네스를 붙인 상태입니다.

## 실행

개발 중에는 프로젝트 폴더에서 아래 명령을 사용합니다. 현재 MVP는 브라우저 Babel 기반 정적 앱이므로, 디자인을 보존하기 위해 순수 Node 정적 서버로 실행합니다.

```powershell
npm install
npm run dev
```

접속:

```text
http://localhost:7754/
```

기존 발표용 HTML도 그대로 유지됩니다.

```text
http://localhost:7754/Re-Link%20AI%20Mobile%20MVP.html
```

Node/Vite 설치 전에는 기존 방식으로도 실행할 수 있습니다.

```powershell
python -m http.server 7654
```

정적 배포물은 아래 명령으로 `dist/`에 생성합니다.

```powershell
npm run build
```

## 주요 구성

- `index.html`: 개발 서버용 진입점. 기존 JSX 파일을 같은 순서로 로드합니다.
- `scripts/dev-server.mjs`: 현재 정적 MVP를 포트 7654에서 서빙하는 개발 서버입니다.
- `scripts/build-static.mjs`: 현재 정적 MVP 구조를 그대로 `dist/`에 복사하는 빌드 스크립트입니다.
- `Re-Link AI Mobile MVP.html`: 원본 발표용 정적 MVP 진입점입니다.
- `app.jsx`: iOS 프레임, 하단 탭, 전역 상태를 포함한 앱 루트입니다.
- `data.jsx`: mock 데이터, 지원 정보, 리포트/문의문 데이터를 정의합니다.
- `api-client.jsx`: 실제 백엔드 연동을 위한 API adapter와 local mock fallback입니다.
- `room.jsx`: 위키룸 및 인터랙티브 메인 화면입니다.
- `screens-home.jsx`: 오늘 기록, 관찰 정보, 하루 부탁 미리보기 카드입니다.
- `screens-other.jsx`: 기록 히스토리, 생활 흐름 리포트, 상담/지원 문의 준비 화면입니다.
- `screens-shop.jsx`: 위키룸 꾸미기 화면입니다.
- `screens-wiki.jsx`: 위키 성장 화면입니다.
- `primitives.jsx`, `mascot.jsx`, `ios-frame.jsx`: 공통 UI와 캐릭터/프레임 컴포넌트입니다.
- `docs/FRONTEND_DEVELOPMENT_PLAN.md`: 디자인 보존 원칙과 단계별 개발 계획입니다.

## 현재 상태

현재 버전은 발표용 MVP이며, AI 분석과 지원 정보는 mock/규칙 기반으로 동작합니다. 실제 백엔드를 연결할 때는 `window.RELINK_API_BASE_URL`을 지정하고 `api-client.jsx`의 adapter를 통해 API로 전환하면 됩니다.

디자인 변경은 별도 의사결정 전까지 금지하고, 기능 개발은 먼저 `api-client.jsx` 경계 뒤쪽에서 진행합니다.
