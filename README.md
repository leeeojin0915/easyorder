# 이지오더 (EasyOrder)

키오스크·테이블오더 같은 무인 주문 기기를 어려워하는 분들이, 실제 매장에 가기 전에 앱으로 미리 연습해볼 수 있게 해주는 서비스. 지금까지 Claude와 함께 기획(PRD) → 설계(IA/데이터 스키마/와이어프레임) → 구현(웹 프로토타입) → 테스트(자동 테스트 + QA 체크리스트)까지 진행했고, 이 저장소부터는 인텔리제이에서 이어서 개발한다.

## 폴더 구조

```
easyorder/
├── docs/                  ← 기획·설계 문서 (PRD, IA, 데이터 스키마, 기술스택, QA 계획)
├── content-pipeline/      ← 브랜드별 콘텐츠(JSON, menu.categories[].items[] 구조) + 검증/테스트 스크립트
│   ├── brands/            ← 서브웨이·버거킹·맥도날드·롯데리아·KFC 실데이터
│   ├── tests/              ← 장바구니(cart) 로직 자동 테스트
│   └── validate.js         ← 브랜드 JSON 형식 검증 스크립트
├── src/
│   ├── App.jsx             ← 웹 프로토타입 본체 (모드선택→매장선택→다이닝옵션→카테고리→아이템커스터마이징→장바구니→결제 흐름)
│   ├── main.jsx             ← React 엔트리 포인트
│   └── lib/storage.js       ← 로컬 저장소 유틸 (아래 "저장소 관련 유의사항" 참고)
├── mobile/                ← React Native(Expo) 포팅 — 웹 프로토타입과 동일 로직/화면을 미러링
│   ├── App.js               ← 루트 컴포넌트 (상태 소유)
│   └── src/
│       ├── screens/          ← 화면별 컴포넌트 (웹의 screen === '...' 블록과 1:1 대응)
│       ├── components/       ← 공유 UI 컴포넌트 (StepTracker, CartBar, FoodIcon 등)
│       └── lib/content.js    ← content-pipeline JSON을 직접 import해서 CONTENT로 변환
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

## React Native(Expo) 포팅 열어보는 법

`mobile/` 폴더가 별도 Expo 프로젝트다.
```
cd mobile
npm install          # 이미 설치돼 있으면 생략 가능
npx expo start --web # 이 개발 환경처럼 시뮬레이터/Expo Go가 없을 때는 웹 프리뷰로 확인
```
실제 폰으로 확인하려면 `npx expo start`로 띄운 뒤 QR코드를 Expo Go 앱으로 스캔한다(폰과 노트북이 같은 Wi-Fi에 있어야 하며, 다른 네트워크면 `--tunnel` 옵션 사용).

## 콘텐츠 데이터 작업 시

새 브랜드를 추가하거나 기존 브랜드 데이터를 고칠 때는 항상 아래 두 스크립트를 돌린다 (`content-pipeline/README.md`에 상세 절차 있음):
```
npm run content:validate   # 브랜드 JSON 형식 검증
npm run content:test       # 장바구니(cart) 로직 검증
```
브랜드 JSON을 수정하면 **`src/App.jsx`의 하드코딩된 `CONTENT` 객체도 같이 갱신**해야 한다(웹은 아직 JSON을 직접 fetch/import하지 않고 코드 안에 복사본을 들고 있음). `mobile/`은 JSON을 직접 import하므로 별도 동기화가 필요 없다.

## 저장소(storage) 관련 유의사항 — 꼭 읽어볼 것

`src/App.jsx`는 원래 Claude.ai 아티팩트 안에서만 동작하는 `window.storage` API(설정값·저장된 주문을 영구 저장하는 기능)를 쓰고 있었다. 이 저장소에서는 일반 브라우저에서도 동작하도록 `src/lib/storage.js`에 **localStorage 기반의 대체 구현**을 만들어 연결해뒀다.

- 웹은 지금도 이 상태(localStorage 기반)로 계속 개발한다.
- `mobile/src/lib/storage.js`는 실제로 `AsyncStorage` 기반으로 이미 교체 완료했다 — 두 파일의 인터페이스(`get/set/delete`)는 동일하게 유지되므로, 상위 로직(App.js/App.jsx)은 어느 쪽 storage든 코드 변경 없이 그대로 쓴다.

## 지금까지의 진행 상황 요약

- ✅ 기획: PRD, 콘텐츠 확장 PRD
- ✅ 설계: IA, 데이터 스키마(브랜드/기계형태/장바구니 구조/다이닝옵션 포함), 와이어프레임
- ✅ 구현: 5개 브랜드(서브웨이/버거킹/맥도날드/롯데리아/KFC) 연습모드·실시간모드 웹 프로토타입, 콘텐츠 파이프라인, 자동 테스트(156개)
- ✅ 이식: React Native(Expo) 포팅 (`mobile/`) — 웹과 동일 로직/화면 미러링
- ✅ 개편: 네비게이션 순서(모드 선택 → 매장 선택), 장바구니(카트) 기반 다중 아이템 주문 구조, 세트-음료 결합 해제(세트 무관하게 음료 단독 구매 가능)
- ✅ 정합성 개선(v1.3 시리즈, `docs/키오스크도우미_데이터스키마.md` §7.6~7.12 참고): 매장식사/포장을 묻는 다이닝옵션 화면 신설, 장바구니 확인 화면 문구 실제 연결, 서브웨이 10단계 커스터마이징 전면 재작업, KFC 치킨버킷·반반맛조합·박스 티어 추가, 버거킹 세트 사이드+음료 이중교체·사이드 단독구매 카테고리, 맥도날드 세트업그레이드·맥플러리 맛종류 분리, 롯데리아 치킨 조각수/소스 커스터마이징 — 전부 웹/모바일 양쪽에 동일 반영, 실제 매장 조사(공식 사이트·나무위키·리뷰) 기반
- 🔜 다음: `docs/키오스크도우미_QA테스트계획.md`의 수동 체크리스트(§9 실사용자 테스트) 진행, KFC 메뉴명 전체 재검토(§8), 각 브랜드 `_source_notes`에 남은 추정 가격의 현장 확인 → 배포 준비 (실기기 Expo Go 테스트)

## 다음 세션에서 이어가는 법

이 저장소를 열고 나서 Claude에게 다시 작업을 맡길 때는, `docs/` 폴더의 문서와 이 README를 먼저 참고하도록 알려주면 지금까지의 결정 사항(예: 조건부 단계 스키마, 몰입형 키오스크 UI 방향)을 그대로 이어서 작업할 수 있다.
