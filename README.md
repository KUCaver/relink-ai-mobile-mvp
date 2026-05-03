# Re:Link AI Mobile MVP Frontend

Re:Link AI의 발표용 모바일 프론트 MVP입니다.

## 실행

정적 서버에서 아래 파일을 열면 됩니다.

```text
Re-Link AI Mobile MVP.html
```

로컬 예시:

```powershell
python -m http.server 5174 --bind 127.0.0.1
```

접속:

```text
http://127.0.0.1:5174/Re-Link%20AI%20Mobile%20MVP.html
```

## 주요 구성

- `app.jsx`: iOS 프레임, 하단 탭, 전역 상태
- `data.jsx`: mock 데이터, 지원 후보, 리포트/문의문 데이터
- `api-client.jsx`: 실제 백엔드 연동을 위한 API adapter와 local mock fallback
- `room.jsx`: 위키의 방 인터랙티브 메인 화면
- `screens-home.jsx`: 오늘 기록, 관찰 후보, 하루 부탁, 미리보기 카드
- `screens-other.jsx`: 기록 히스토리, 생활 흐름 리포트, 위키 성장, 상담·지원 문의 준비
- `screens-shop.jsx`: 위키의 방 꾸미기
- `primitives.jsx`, `mascot.jsx`, `ios-frame.jsx`: 공통 UI와 캐릭터

## 현재 상태

현재 버전은 발표용 MVP이며, AI 분석과 지원 후보는 mock/규칙 기반으로 동작합니다.
실제 백엔드 연결 시 `window.RELINK_API_BASE_URL`을 지정하면 `api-client.jsx`의 adapter를 통해 API로 전환할 수 있습니다.
