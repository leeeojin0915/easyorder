# 콘텐츠 파이프라인 (브랜드 확장용)

브랜드가 계속 늘어나는 걸 전제로, "브랜드 하나 = 파일 하나" 구조로 관리한다.
지금은 로컬 폴더로 예시를 만들었지만, 실제 서비스에서는 이 폴더 구조 그대로 콘텐츠 서버(기술스택 문서 6장)에 올린다.

```
content-pipeline/
├── index.json          ← 전체 브랜드 등록 목록 (레지스트리)
├── brands/
│   ├── _template.json  ← 새 브랜드 추가 시 복사해서 채우는 빈 양식
│   ├── subway.json     ← 실제 브랜드 데이터 (조사 완료 → live)
│   └── burgerking.json
├── tests/
│   └── cart.test.js    ← 장바구니(cart) 로직 자동 테스트 (아이템 스코프 조건부 포함)
└── validate.js         ← 브랜드 파일 형식이 맞는지 자동 검사하는 스크립트
```

새 브랜드를 추가하거나 기존 브랜드 데이터를 수정한 뒤에는 항상 두 가지를 실행한다:
```
node validate.js              # 형식 검증
node tests/cart.test.js       # 장바구니 로직 검증
```

## 데이터 모델 (v1.3, 실제 키오스크 정합성 개선 반영)

브랜드 하나는 **메뉴(MENU) = 카테고리(CATEGORY) 목록 → 각 카테고리는 아이템(ITEM) 목록 → 각 아이템은 자기만의 커스터마이징 단계(STEP)**를 갖는다. 사용자는 여러 아이템을 장바구니에 담아 한번에 결제한다(브랜드당 하나의 순차 흐름이었던 v1.0/v1.1과 다르다 — 자세한 배경은 `docs/키오스크도우미_데이터스키마.md` §7.4 참고).

```jsonc
{
  "brand_id": "...", "brand_name": "...", "category": "...",
  "store_example": { "name": "...", "sub": "..." },
  "device": { "shape": "...", "orientation": "...", "theme": { ... } },
  "dining_options": {
    "step_id": "dining", "type": "binary_choice",
    "title": "매장에서 드실 건가요, 포장하시겠어요?", "voice_text": "...",
    "options": [{ "option_id": "dine_in", "label": "매장에서 식사", "price": 0 }, { "option_id": "takeaway", "label": "포장", "price": 0 }]
  },
  "menu": {
    "menu_id": "{brand_id}_default_v1",
    "categories": [
      {
        "category_id": "burgers", "label": "버거",
        "items": [
          {
            "item_id": "bigmac", "label": "빅맥", "base_price": 5700, "visual": "burger",
            "customize_steps": [ /* single_select | multi_select | binary_choice, 이 아이템에만 스코프 */ ]
          }
        ]
      },
      { "category_id": "drinks", "label": "음료", "items": [ /* customize_steps: [] 로 비워두면 커스터마이징 없이 바로 장바구니에 담김 */ ] }
    ]
  },
  "order_steps": [
    { "step_id": "confirm_order", "type": "confirm", ... },
    { "step_id": "payment", "type": "payment_mock", ..., "options": [ /* icon 필드 사용 */ ] }
  ]
}
```

`order_steps`는 반드시 `confirm` 1개 다음 `payment_mock` 1개 순서로 정확히 2개여야 한다. `customize_steps`에는 `confirm`/`payment_mock`을 쓸 수 없다(장바구니 전체 단위로만 의미가 있어서 `order_steps`로 옮겼다).

**`dining_options`(v1.3 신규, 브랜드 필수 필드)** — 매장식사/포장 여부. `menu`/`order_steps`와 형제 관계인 별도 최상위 필드다. `order_steps`에 넣지 않은 이유: `order_steps`는 "confirm 1개 + payment_mock 1개, 정확히 2개"로 고정 검증되고 의미상 장바구니 확인/결제 단계를 뜻하는데, 매장식사/포장은 메뉴 브라우징을 시작하기 **전에** 묻는 질문이라 순서·의미가 어긋난다. 화면상으로는 매장 선택 직후, 카테고리 브라우징 시작 전에 노출된다. 자세한 배경은 데이터스키마 §7.6 참고.

**`max_selections`(v1.3 신규, `multi_select` 스텝 전용 선택 필드)** — "최대 N개까지"만 고를 수 있는 단계에 사용(예: 서브웨이 소스 최대 3개, KFC 치킨버킷 맛조합 최대 2개). `1 ≤ max_selections ≤ options.length`인 정수여야 하고, 초과 선택 시 그냥 선택이 막힌다(이미 선택한 항목은 해제 가능).

**세트 + 음료 패턴** (5개 브랜드 공통): 버거/샌드위치 아이템의 `customize_steps`에 `set`(binary_choice) 다음 `included_drink`(single_select, `condition: {step_id: "set", option_id: "set"}`)를 두면 "세트 선택 시에만 무료 음료 선택 단계가 나타남" 동작이 된다. 이와 별개로 `drinks` 카테고리에 같은 음료를 유료 단독 아이템(`customize_steps: []`)으로도 등록해서, 세트를 고르지 않아도 음료만 따로 장바구니에 담을 수 있게 한다 — 이 "두 경로 공존"이 장바구니 구조 개편의 핵심이었다.

**조건부 스텝 다중 참조** (버거킹/서브웨이) — `included_side`와 `included_drink`처럼 서로 다른 스텝 2개가 **동일한** `condition`(예: `{step_id:"set", option_id:"set"}`)을 참조해도 문제없다. `validate.js`의 조회 로직에 단일 소비자 제약이 없어서 스키마·검증기 변경 없이 그대로 동작한다.

## 새 브랜드를 추가하는 절차

1. `brands/_template.json`을 복사해서 `brands/{brand_id}.json`으로 이름 바꾸기
   (brand_id 규칙: 소문자 영문, 띄어쓰기 없이. 예: `mcdonalds`, `lotteria`, `kfc`)
2. 콘텐츠 확장 PRD의 "섹션 4 조사 체크리스트" 내용을 바탕으로 카테고리/아이템/customize_steps 채우기
3. `index.json`에 이 브랜드를 한 줄 추가 (`status: "researching"`으로 시작)
4. 조사·입력이 끝나면 `node validate.js brands/{brand_id}.json` 실행해서 형식 검증
5. 통과하면 `index.json`의 `status`를 `"ready"` → 실제 앱 반영 후 `"live"`로 변경

## ID 네이밍 규칙 (브랜드가 늘어나도 충돌 안 나게)

| 항목 | 규칙 | 예시 |
|---|---|---|
| `brand_id` | 소문자 영문, 고유 | `mcdonalds` |
| `menu_id` | `{brand_id}_default_v1` | `mcdonalds_default_v1` |
| `category_id` | 브랜드 안에서만 고유하면 됨 | `burgers`, `drinks` |
| `item_id` | **카테고리 안이 아니라 브랜드 전체에서 고유해야 함** (장바구니가 item_id만으로 아이템을 참조) | `bigmac`, `coke_standalone` |
| `step_id` (customize_steps) | 그 아이템 안에서만 고유하면 됨 | `set`, `included_drink` |
| `option_id` | 스텝 안에서만 고유하면 됨 | `card`, `phone` |

버전(`_v1`, `_v2`)을 붙여두는 이유: 나중에 같은 브랜드의 화면이 개편되면 새 버전 파일을 추가하고 `index.json`에서 가리키는 버전만 바꾸면 되고, 기존에 저장된 사용자의 "내 주문"(장바구니 스냅샷)은 예전 버전 데이터를 참조해도 깨지지 않는다.

## status 값의 의미 (브랜드가 많아질수록 진행 상황 추적용)

| status | 의미 |
|---|---|
| `researching` | 조사 중, 아직 데이터 없음 |
| `draft` | 데이터는 채웠지만 검증/검토 전 |
| `ready` | 검증 통과, 앱 반영 대기 |
| `live` | 실제 앱에 반영되어 사용자에게 노출 중 |

## 앱과의 관계

- **웹 프로토타입(`src/App.jsx`)**: 브랜드 데이터를 `CONTENT` 객체로 코드 안에 직접 복사해서 갖고 있다(이 폴더의 JSON과 항상 같은 내용을 유지해야 함 — 브랜드 JSON을 수정하면 `src/App.jsx`의 `CONTENT`도 같이 갱신할 것). 실제 서비스에서는 콘텐츠 서버에서 fetch하는 방식으로 바뀔 예정.
- **모바일(`mobile/`)**: `mobile/src/lib/content.js`가 이 폴더의 JSON 파일들을 Metro의 `watchFolders` 설정을 통해 **직접 import**한다. 브랜드 JSON을 수정하면 별도 동기화 작업 없이 자동으로 반영된다.
