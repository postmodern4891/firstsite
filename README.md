# Steam 게임 사양 검색기 (웹 + 데스크톱)

Steam 게임을 검색하고 최소/권장 사양을 확인하는 간단한 웹앱입니다.

## 웹 실행 방법

1. Node.js 18+ 설치
2. 의존성 설치

```bash
npm install
```

3. 서버 실행

```bash
npm start
```

4. 브라우저에서 접속

`http://localhost:3000`

## 윈도우 데스크톱 실행 방법 (Electron)

1. 의존성 설치

```bash
npm install
```

2. 데스크톱 앱 실행

```bash
npm run desktop
```

실행 시 Electron이 자동으로 로컬 서버를 띄우고 앱 창을 엽니다.

## 윈도우 설치파일(.exe) 빌드

1. 의존성 설치

```bash
npm install
```

2. 설치파일 빌드

```bash
npm run dist:win
```

3. 결과물 위치

`release/` 폴더에 NSIS 설치파일(`.exe`)이 생성됩니다.

## 기능

- 게임명으로 Steam 검색
- 검색 결과 클릭 시 해당 게임의:
  - 최소 사양
  - 권장 사양
  표시

## 파일 구조

- `server.js`: Express 서버, Steam API 프록시
- `electron-main.js`: Electron 메인 프로세스
- `public/index.html`: UI
- `public/main.js`: 클라이언트 로직
- `public/styles.css`: 스타일
