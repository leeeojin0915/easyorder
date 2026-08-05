#!/usr/bin/env node
/**
 * 조건부 단계(condition) 로직이 실제로 맞는지 검증하는 테스트.
 * 프로토타입(easyorder-prototype.jsx)의 stepVisible / computeTotal 로직을
 * 그대로 재구현해서, 브랜드 JSON 데이터를 입력으로 돌려본다.
 * 사용법: node tests/conditional-steps.test.js
 */
const fs = require('fs');
const path = require('path');

function loadBrand(id) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'brands', `${id}.json`), 'utf8'));
}

function stepVisible(s, sel) {
  if (!s.condition) return true;
  const chosen = sel[s.condition.step_id] || [];
  return chosen.includes(s.condition.option_id);
}
function visibleSteps(brand, sel) {
  return brand.flow.steps.filter((s) => stepVisible(s, sel));
}
function computeTotal(brand, sel) {
  let total = brand.flow.base_price || 0;
  visibleSteps(brand, sel).forEach((s) => {
    if (!s.options || s.type === 'payment_mock') return;
    (sel[s.step_id] || []).forEach((oid) => {
      const opt = s.options.find((o) => o.option_id === oid);
      if (opt?.price) total += opt.price;
    });
  });
  return total;
}

let pass = 0, failCount = 0;
function assertEqual(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) { pass++; console.log(`✅ ${label}`); }
  else { failCount++; console.log(`❌ ${label} — 기대값: ${JSON.stringify(expected)}, 실제값: ${JSON.stringify(actual)}`); }
}

['mcdonalds', 'lotteria', 'kfc'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const menuStep = brand.flow.steps.find((s) => s.step_id === 'menu');
  const cheapestMenuOpt = menuStep.options[0];

  // 시나리오 A: 단품 선택 → drink 단계는 노출되면 안 되고, 가격에도 안 들어가야 함
  const selSingle = { menu: [cheapestMenuOpt.option_id], set: ['single'] };
  const visibleA = visibleSteps(brand, selSingle).map((s) => s.step_id);
  assertEqual(`[${brandId}] 단품 선택 시 drink 단계 숨김`, visibleA.includes('drink'), false);
  assertEqual(`[${brandId}] 단품 선택 시 총액 = 메뉴가만`, computeTotal(brand, selSingle), cheapestMenuOpt.price);

  // 시나리오 B: 세트 선택 → drink 단계 노출, 가격에 세트업+음료값 포함
  const drinkStep = brand.flow.steps.find((s) => s.step_id === 'drink');
  const paidDrink = drinkStep.options.find((o) => o.price > 0) || drinkStep.options[0];
  const setDelta = brand.flow.steps.find((s) => s.step_id === 'set').options.find((o) => o.option_id === 'set').price;
  const selSet = { menu: [cheapestMenuOpt.option_id], set: ['set'], drink: [paidDrink.option_id] };
  const visibleB = visibleSteps(brand, selSet).map((s) => s.step_id);
  assertEqual(`[${brandId}] 세트 선택 시 drink 단계 노출`, visibleB.includes('drink'), true);
  assertEqual(`[${brandId}] 세트 선택 시 총액 = 메뉴가+세트업+음료`, computeTotal(brand, selSet), cheapestMenuOpt.price + setDelta + paidDrink.price);

  // 시나리오 C (회귀 테스트): 단품인데 drink 선택값이 남아있어도(이전 상태 잔존) 무시되어야 함 — 이게 원래 버그였음
  const selStale = { menu: [cheapestMenuOpt.option_id], set: ['single'], drink: [paidDrink.option_id] };
  assertEqual(`[${brandId}] 단품 + 잔존 drink 선택 있어도 총액에 미포함 (회귀 테스트)`, computeTotal(brand, selStale), cheapestMenuOpt.price);
});

// subway/burgerking: condition 없는 기존 브랜드가 여전히 정상 동작하는지 (하위 호환)
['subway', 'burgerking'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const all = visibleSteps(brand, {}).length;
  assertEqual(`[${brandId}] condition 없는 브랜드는 모든 단계가 항상 노출`, all, brand.flow.steps.length);
});

console.log(`\n${pass}개 통과, ${failCount}개 실패`);
process.exit(failCount === 0 ? 0 : 1);
