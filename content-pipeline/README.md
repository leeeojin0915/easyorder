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
│   └── conditional-steps.test.js  ← 조건부 단계(condition) 로직 자동 테스트
└── validate.js         ← 브랜드 파일 형식이 맞는지 자동 검사하는 스크립트
```

새 브랜드를 추가하거나 기존 브랜드 데이터를 수정한 뒤에는 항상 두 가지를 실행한다:
```
node validate.js                        # 형식 검증
node tests/conditional-steps.test.js    # condition(조건부 단계) 로직 검증
```

## 새 브랜드를 추가하는 절차

1. `brands/_template.json`을 복사해서 `brands/{brand_id}.json`으로 이름 바꾸기
   (brand_id 규칙: 소문자 영문, 띄어쓰기 없이. 예: `mcdonalds`, `lotteria`, `kfc`)
2. 콘텐츠 확장 PRD의 "섹션 4 조사 체크리스트" 내용을 바탕으로 파일 채우기
3. `index.json`에 이 브랜드를 한 줄 추가 (`status: "researching"`으로 시작)
4. 조사·입력이 끝나면 `node validate.js brands/{brand_id}.json` 실행해서 형식 검증
5. 통과하면 `index.json`의 `status`를 `"ready"` → 실제 앱 반영 후 `"live"`로 변경

## ID 네이밍 규칙 (브랜드가 늘어나도 충돌 안 나게)

| 항목 | 규칙 | 예시 |
|---|---|---|
| `brand_id` | 소문자 영문, 고유 | `mcdonalds` |
| `device_id` | `{brand_id}_device_v1` | `mcdonalds_device_v1` |
| `flow_id` | `{brand_id}_default_v1` | `mcdonalds_default_v1` |
| `step_id` | 플로우 안에서만 고유하면 됨 (브랜드 간 중복 허용) | `menu`, `set`, `payment` |
| `option_id` | 스텝 안에서만 고유하면 됨 | `card`, `phone` |

버전(`_v1`, `_v2`)을 붙여두는 이유: 나중에 같은 브랜드의 화면이 개편되면 새 버전 파일을 추가하고 `index.json`에서 가리키는 버전만 바꾸면 되고, 기존에 저장된 사용자의 "내 주문"은 예전 버전 데이터를 참조해도 깨지지 않는다.

## status 값의 의미 (브랜드가 많아질수록 진행 상황 추적용)

| status | 의미 |
|---|---|
| `researching` | 조사 중, 아직 데이터 없음 |
| `draft` | 데이터는 채웠지만 검증/검토 전 |
| `ready` | 검증 통과, 앱 반영 대기 |
| `live` | 실제 앱에 반영되어 사용자에게 노출 중 |

## 지금 이 데모(React 프로토타입)와의 관계

지금 만든 `easyorder-prototype.jsx`는 브랜드 데이터를 코드 안에 직접 넣어둔 상태다.
이 콘텐츠 파이프라인이 자리잡으면, 프로토타입의 `CONTENT` 객체를 이 폴더의 JSON 파일들을 읽어오는 방식으로 바꾸는 게 다음 작업이다 (실제 앱에서는 콘텐츠 서버에서 다운로드).
