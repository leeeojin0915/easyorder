# 이지오더 (EasyOrder)

키오스크·테이블오더 같은 무인 주문 기기를 어려워하는 분들이, 실제 매장에 가기 전에 앱으로 미리 연습해볼 수 있게 해주는 서비스. 지금까지 Claude와 함께 기획(PRD) → 설계(IA/데이터 스키마/와이어프레임) → 구현(웹 프로토타입) → 테스트(자동 테스트 + QA 체크리스트)까지 진행했고, 이 저장소부터는 인텔리제이에서 이어서 개발한다.

## 폴더 구조

```
easyorder/
├── docs/                  ← 기획·설계 문서 (PRD, IA, 데이터 스키마, 기술스택, QA 계획)
├── content-pipeline/      ← 브랜드별 콘텐츠(JSON) + 검증/테스트 스크립트
│   ├── brands/            ← 서브웨이·버거킹·맥도날드·롯데리아·KFC 실데이터
│   ├── tests/              ← 조건부 단계(condition) 로직 자동 테스트
│   └── validate.js         ← 브랜드 JSON 형식 검증 스크립트
├── src/
│   ├── App.jsx             ← 웹 프로토타입 본체 (지금까지 만든 화면 전부)
│   ├── main.jsx             ← React 엔트리 포인트
│   └── lib/storage.js       ← 로컬 저장소 유틸 (아래 "저장소 관련 유의사항" 참고)
├── index.html
├── package.json
└── vite.config.js
```

## 인텔리제이에서 여는 법

1. 이 폴더를 IntelliJ IDEA(또는 WebStorm)에서 "Open"으로 연다. Node.js 플러그인이 설치되어 있어야 `package.json`을 인식한다.
2. 터미널에서 의존성 설치:
   ```
   npm install
   ```
3. 개발 서버 실행:
   ```
   npm run dev
   ```
   콘솔에 뜨는 로컬 주소(보통 http://localhost:5173)로 접속하면 프로토타입이 뜬다.
4. 빌드 확인(문법 오류 등을 잡을 때):
   ```
   npm run build
   ```

## 콘텐츠 데이터 작업 시

새 브랜드를 추가하거나 기존 브랜드 데이터를 고칠 때는 항상 아래 두 스크립트를 돌린다 (`content-pipeline/README.md`에 상세 절차 있음):
```
npm run content:validate   # 브랜드 JSON 형식 검증
npm run content:test       # 조건부 단계(condition) 로직 검증
```

## 저장소(storage) 관련 유의사항 — 꼭 읽어볼 것

`src/App.jsx`는 원래 Claude.ai 아티팩트 안에서만 동작하는 `window.storage` API(설정값·저장된 주문을 영구 저장하는 기능)를 쓰고 있었다. 이 저장소에서는 일반 브라우저에서도 동작하도록 `src/lib/storage.js`에 **localStorage 기반의 대체 구현**을 만들어 연결해뒀다.

- 지금(웹 프로토타입 단계)은 이 상태로 계속 개발해도 된다.
- 기술스택 문서(`docs/키오스크도우미_기술스택.md`)에서 정한 대로 나중에 React Native(Expo)로 옮길 때는, `src/lib/storage.js` **이 파일 하나만** `AsyncStorage` 기반으로 바꿔치기하면 되고, `App.jsx`의 나머지 로직은 거의 그대로 재사용 가능하도록 설계해뒀다.

## 지금까지의 진행 상황 요약

- ✅ 기획: PRD, 콘텐츠 확장 PRD
- ✅ 설계: IA, 데이터 스키마(브랜드/기계형태/조건부단계 포함), 와이어프레임
- ✅ 구현: 5개 브랜드(서브웨이/버거킹/맥도날드/롯데리아/KFC) 연습모드·실시간모드 웹 프로토타입, 콘텐츠 파이프라인, 자동 테스트
- 🔜 다음: `docs/키오스크도우미_QA테스트계획.md`의 수동 체크리스트 진행 → React Native(Expo) 이식 → 배포 준비

## 다음 세션에서 이어가는 법

이 저장소를 열고 나서 Claude에게 다시 작업을 맡길 때는, `docs/` 폴더의 문서와 이 README를 먼저 참고하도록 알려주면 지금까지의 결정 사항(예: 조건부 단계 스키마, 몰입형 키오스크 UI 방향)을 그대로 이어서 작업할 수 있다.
