#!/usr/bin/env node
/**
 * 장바구니(카트) 로직이 실제로 맞는지 검증하는 테스트.
 * 프로토타입의 아이템 단가 계산 / 장바구니 담기·삭제 / 아이템 스코프 조건부 로직을
 * 그대로 재구현해서, 브랜드 JSON 데이터를 입력으로 돌려본다.
 * 사용법: node tests/cart.test.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadBrand(id) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'brands', `${id}.json`), 'utf8'));
}

function getItem(brand, categoryId, itemId) {
  const cat = brand.menu.categories.find((c) => c.category_id === categoryId);
  return cat.items.find((i) => i.item_id === itemId);
}

function itemStepVisible(step, itemSelections) {
  if (!step.condition) return true;
  const chosen = itemSelections[step.condition.step_id] || [];
  return chosen.includes(step.condition.option_id);
}
function visibleCustomizeSteps(item, itemSelections) {
  return item.customize_steps.filter((s) => itemStepVisible(s, itemSelections));
}
function computeItemUnitPrice(item, itemSelections) {
  let total = item.base_price || 0;
  visibleCustomizeSteps(item, itemSelections).forEach((s) => {
    (itemSelections[s.step_id] || []).forEach((oid) => {
      const opt = s.options.find((o) => o.option_id === oid);
      if (opt?.price) total += opt.price;
    });
  });
  return total;
}
function computeCartTotal(cart) {
  return cart.reduce((sum, line) => sum + line.lineTotal, 0);
}
function selectionsEqual(a, b) {
  const aKeys = Object.keys(a).sort();
  const bKeys = Object.keys(b).sort();
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((k, i) => {
    if (bKeys[i] !== k) return false;
    const av = a[k] || [];
    const bv = b[k] || [];
    return av.length === bv.length && av.every((v, j) => v === bv[j]);
  });
}
function addCartLine(cart, brand, { categoryId, itemId, customizeSelections }) {
  const item = getItem(brand, categoryId, itemId);
  const unitPrice = computeItemUnitPrice(item, customizeSelections);
  const existing = cart.find((l) => l.itemId === itemId && selectionsEqual(l.customizeSelections, customizeSelections));
  if (existing) {
    return cart.map((l) => (l === existing ? { ...l, qty: l.qty + 1, lineTotal: unitPrice * (l.qty + 1) } : l));
  }
  const cartItemId = `${itemId}_${cart.length}_${Math.random().toString(36).slice(2)}`;
  return [...cart, { cartItemId, categoryId, itemId, label: item.label, customizeSelections, unitPrice, qty: 1, lineTotal: unitPrice }];
}
function removeCartLine(cart, cartItemId) {
  return cart.filter((l) => l.cartItemId !== cartItemId);
}
function isStepAtSelectionCap(step, currentSelection) {
  return step.max_selections !== undefined && currentSelection.length >= step.max_selections;
}
function canProceedCustomize(step, currentSelection) {
  return step.required === false || currentSelection.length > 0;
}
function toggleOption(step, currentSelection, optId) {
  if (step.type !== 'multi_select') return [optId];
  if (currentSelection.includes(optId)) return currentSelection.filter((o) => o !== optId);
  if (isStepAtSelectionCap(step, currentSelection)) return currentSelection;
  return [...currentSelection, optId];
}

let pass = 0, failCount = 0;
function assertEqual(label, actual, expected) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (ok) { pass++; console.log(`✅ ${label}`); }
  else { failCount++; console.log(`❌ ${label} — 기대값: ${JSON.stringify(expected)}, 실제값: ${JSON.stringify(actual)}`); }
}

['mcdonalds', 'lotteria', 'kfc', 'burgerking'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const burgerItem = getItem(brand, 'burgers', brand.menu.categories.find((c) => c.category_id === 'burgers').items[0].item_id);

  // 시나리오 1: 단품 선택 -> included_drink 단계 숨김, 가격 미포함
  const singleSel = { set: ['single'] };
  const visibleSingle = visibleCustomizeSteps(burgerItem, singleSel).map((s) => s.step_id);
  assertEqual(`[${brandId}] 단품 선택 시 included_drink 단계 숨김`, visibleSingle.includes('included_drink'), false);
  assertEqual(`[${brandId}] 단품 선택 시 단가 = base_price`, computeItemUnitPrice(burgerItem, singleSel), burgerItem.base_price);

  // 시나리오 2: 세트 선택 -> included_drink 노출 + 가격 포함
  const drinkStep = burgerItem.customize_steps.find((s) => s.step_id === 'included_drink');
  const paidDrinkOpt = drinkStep.options.find((o) => o.price > 0) || drinkStep.options[0];
  const setDelta = burgerItem.customize_steps.find((s) => s.step_id === 'set').options.find((o) => o.option_id === 'set').price;
  const setSel = { set: ['set'], included_drink: [paidDrinkOpt.option_id] };
  const visibleSet = visibleCustomizeSteps(burgerItem, setSel).map((s) => s.step_id);
  assertEqual(`[${brandId}] 세트 선택 시 included_drink 단계 노출`, visibleSet.includes('included_drink'), true);
  assertEqual(`[${brandId}] 세트 선택 시 단가 = base+세트+음료프리미엄`, computeItemUnitPrice(burgerItem, setSel), burgerItem.base_price + setDelta + paidDrinkOpt.price);

  // 시나리오 3 (회귀 테스트): 단품인데 included_drink 선택값이 잔존해도 무시
  const staleSel = { set: ['single'], included_drink: [paidDrinkOpt.option_id] };
  assertEqual(`[${brandId}] 단품 + 잔존 included_drink 선택 있어도 단가에 미포함 (회귀 테스트)`, computeItemUnitPrice(burgerItem, staleSel), burgerItem.base_price);

  // 시나리오 4: 빈 customize_steps 아이템(단독 음료) -> 라인 총액 = base_price 그대로
  const standaloneDrink = brand.menu.categories.find((c) => c.category_id === 'drinks').items[0];
  assertEqual(`[${brandId}] 단독 음료(customize_steps 없음) 단가 = base_price`, computeItemUnitPrice(standaloneDrink, {}), standaloneDrink.base_price);

  // 시나리오 5: 버거(세트) 1줄 + 단독 음료 1줄 섞인 장바구니 총액
  let cart = [];
  cart = addCartLine(cart, brand, { categoryId: 'burgers', itemId: burgerItem.item_id, customizeSelections: setSel });
  cart = addCartLine(cart, brand, { categoryId: 'drinks', itemId: standaloneDrink.item_id, customizeSelections: {} });
  const expectedCartTotal = (burgerItem.base_price + setDelta + paidDrinkOpt.price) + standaloneDrink.base_price;
  assertEqual(`[${brandId}] 버거(세트)+단독음료 장바구니 총액`, computeCartTotal(cart), expectedCartTotal);
  assertEqual(`[${brandId}] 장바구니에 버거 없어도 단독 음료 담기 성공 (핵심 요구사항)`, cart.some((l) => l.itemId === standaloneDrink.item_id), true);

  // 시나리오 6: 동일 아이템+동일 옵션 두 번 담으면 qty 병합
  let mergeCart = [];
  mergeCart = addCartLine(mergeCart, brand, { categoryId: 'drinks', itemId: standaloneDrink.item_id, customizeSelections: {} });
  mergeCart = addCartLine(mergeCart, brand, { categoryId: 'drinks', itemId: standaloneDrink.item_id, customizeSelections: {} });
  assertEqual(`[${brandId}] 동일 아이템+동일 옵션 두 번 담으면 라인 1개로 병합`, mergeCart.length, 1);
  assertEqual(`[${brandId}] 병합된 라인의 qty=2`, mergeCart[0].qty, 2);
  assertEqual(`[${brandId}] 병합된 라인의 lineTotal = 단가*2`, mergeCart[0].lineTotal, standaloneDrink.base_price * 2);

  // 시나리오 7: 같은 버거인데 옵션이 다르면(하나는 세트, 하나는 단품) 별도 라인 유지
  let diffCart = [];
  diffCart = addCartLine(diffCart, brand, { categoryId: 'burgers', itemId: burgerItem.item_id, customizeSelections: singleSel });
  diffCart = addCartLine(diffCart, brand, { categoryId: 'burgers', itemId: burgerItem.item_id, customizeSelections: setSel });
  assertEqual(`[${brandId}] 같은 아이템 다른 옵션(단품/세트)은 별도 라인 유지`, diffCart.length, 2);

  // 시나리오 8: 장바구니 라인 삭제 후 총액 재계산
  const removed = removeCartLine(cart, cart[0].cartItemId);
  assertEqual(`[${brandId}] 라인 삭제 후 장바구니 길이 감소`, removed.length, cart.length - 1);
  assertEqual(`[${brandId}] 라인 삭제 후 총액 = 남은 라인 총액`, computeCartTotal(removed), cart[1].lineTotal);
});

// subway: 9단계 플로우 (조건부 스텝 제외 시 단품 기준 모든 스텝 노출)
['subway'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const firstCategory = brand.menu.categories[0];
  const firstItem = firstCategory.items[0];

  // 단품 선택 시 included_side/included_drink(조건부)는 숨겨지고 나머지 8단계만 노출
  const singleSteps = visibleCustomizeSteps(firstItem, { set: ['single'] });
  assertEqual(`[${brandId}] 단품 선택 시 조건부 스텝(included_side/included_drink) 숨김, 8단계 노출`, singleSteps.length, firstItem.customize_steps.length - 2);

  // 세트 선택 시 전체 10단계(조건부 2개 포함) 노출
  const setSteps = visibleCustomizeSteps(firstItem, { set: ['set'] });
  assertEqual(`[${brandId}] 세트 선택 시 전체 10단계 노출`, setSteps.length, firstItem.customize_steps.length);

  // max_selections 캡: 소스는 최대 3개까지만 무료로 선택 가능
  const sauceStep = firstItem.customize_steps.find((s) => s.step_id === 'sauce');
  let sel = [];
  sauceStep.options.slice(0, 4).forEach((opt) => { sel = toggleOption(sauceStep, sel, opt.option_id); });
  assertEqual(`[${brandId}] 소스 max_selections=3 캡: 4번째 선택 시도 시 차단`, sel.length, 3);

  const priceForThree = sel.reduce((sum, oid) => sum + (sauceStep.options.find((o) => o.option_id === oid)?.price || 0), 0);
  assertEqual(`[${brandId}] 소스 3개 이하 선택 시 정상 계산 (모두 0원)`, priceForThree, 0);

  // bread_length 30cm 선택 시 +4000원 반영
  const breadLengthStep = firstItem.customize_steps.find((s) => s.step_id === 'bread_length');
  const price30cm = breadLengthStep.options.find((o) => o.option_id === '30cm').price;
  const selWith30cm = { bread: ['white'], bread_length: ['30cm'], cheese: ['none'], toast: ['no'], vegetables: [], sauce: [], set: ['single'] };
  assertEqual(`[${brandId}] bread_length 30cm 선택 시 +4000원 반영`, computeItemUnitPrice(firstItem, selWith30cm), firstItem.base_price + price30cm);

  // extra_toppings 유료 선택 시 단가 반영
  const toppingsStep = firstItem.customize_steps.find((s) => s.step_id === 'extra_toppings');
  const extraMeatPrice = toppingsStep.options.find((o) => o.option_id === 'extra_meat').price;
  const selWithTopping = { bread: ['white'], bread_length: ['15cm'], cheese: ['none'], extra_toppings: ['extra_meat'], toast: ['no'], vegetables: [], sauce: [], set: ['single'] };
  assertEqual(`[${brandId}] extra_toppings(유료) 선택 시 단가 반영`, computeItemUnitPrice(firstItem, selWithTopping), firstItem.base_price + extraMeatPrice);

  // included_side + included_drink 두 단계 모두 set=세트 조건부 동시 노출
  const setSel = { set: ['set'] };
  const visibleSet = visibleCustomizeSteps(firstItem, setSel).map((s) => s.step_id);
  assertEqual(`[${brandId}] included_side + included_drink 두 단계 모두 set=세트 조건부 동시 노출`,
    visibleSet.includes('included_side') && visibleSet.includes('included_drink'), true);
});

// burgerking: 세트 선택 시 included_side + included_drink 두 조건부 스텝 동시 노출
['burgerking'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const whopper = getItem(brand, 'burgers', 'whopper');
  const setSel = { set: ['set'] };
  const visibleSteps = visibleCustomizeSteps(whopper, setSel).map((s) => s.step_id);
  assertEqual(`[${brandId}] included_side + included_drink 두 단계 모두 set=세트 조건부 동시 노출`,
    visibleSteps.includes('included_side') && visibleSteps.includes('included_drink'), true);

  // set_size 선택 시 +700원 반영
  const withSize = { set: ['set'], included_side: ['fries'], included_drink: ['coke'], set_size: ['large'] };
  const expectedPrice = whopper.base_price + 2000 + 0 + 0 + 700;
  assertEqual(`[${brandId}] set_size 선택 시 +700원 반영`, computeItemUnitPrice(whopper, withSize), expectedPrice);
});

// mcdonalds: set_size 선택 시 +900원 반영
['mcdonalds'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const bigmac = getItem(brand, 'burgers', 'bigmac');
  const withSize = { set: ['set'], included_drink: ['coke'], set_size: ['large'] };
  const expectedPrice = bigmac.base_price + 1900 + 0 + 900;
  assertEqual(`[${brandId}] set_size 선택 시 +900원 반영`, computeItemUnitPrice(bigmac, withSize), expectedPrice);
});

// lotteria: chicken 카테고리 아이템(customize_steps 없음) 장바구니 담기·총액 반영
['lotteria'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const chickenItem = brand.menu.categories.find((c) => c.category_id === 'chicken').items[0];
  assertEqual(`[${brandId}] chicken 카테고리 아이템(customize_steps 없음) 단가 = base_price`, computeItemUnitPrice(chickenItem, {}), chickenItem.base_price);
  let cart = [];
  cart = addCartLine(cart, brand, { categoryId: 'chicken', itemId: chickenItem.item_id, customizeSelections: {} });
  assertEqual(`[${brandId}] chicken 카테고리 아이템 장바구니 담기·총액 반영`, computeCartTotal(cart), chickenItem.base_price);
});

// lotteria: 치킨 조각수/소스 커스터마이징 검증 (v1.3.3)
['lotteria'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const chickenCat = brand.menu.categories.find((c) => c.category_id === 'chicken');

  const fireWing = chickenCat.items.find((i) => i.item_id === 'fire_wing');
  const pieceStep = fireWing.customize_steps.find((s) => s.step_id === 'piece_count');
  const price4pcs = pieceStep.options.find((o) => o.option_id === '4pcs').price;
  assertEqual(`[${brandId}] 화이어윙 2조각 선택 시 base_price 그대로`, computeItemUnitPrice(fireWing, { piece_count: ['2pcs'] }), fireWing.base_price);
  assertEqual(`[${brandId}] 화이어윙 4조각 선택 시 추가금 반영`, computeItemUnitPrice(fireWing, { piece_count: ['4pcs'] }), fireWing.base_price + price4pcs);

  const fillet = chickenCat.items.find((i) => i.item_id === 'chicken_fillet');
  const filletSteps = fillet.customize_steps.map((s) => s.step_id);
  assertEqual(`[${brandId}] 치킨휠레 조각수+소스 2단계 모두 노출`, filletSteps.includes('piece_count') && filletSteps.includes('sauce'), true);

  const fullPack = chickenCat.items.find((i) => i.item_id === 'boneless_chicken_full_pack');
  const fullPackSauceStep = fullPack.customize_steps.find((s) => s.step_id === 'sauce');
  let sel = [];
  fullPackSauceStep.options.forEach((opt) => { sel = toggleOption(fullPackSauceStep, sel, opt.option_id); });
  assertEqual(`[${brandId}] 순살치킨 풀팩 소스 max_selections=2 캡`, sel.length, 2);

  const halfPack = chickenCat.items.find((i) => i.item_id === 'boneless_chicken_half_pack');
  const halfPackSauceStep = halfPack.customize_steps.find((s) => s.step_id === 'sauce');
  assertEqual(`[${brandId}] 순살치킨 하프팩 소스는 single_select(1개만)`, halfPackSauceStep.type, 'single_select');

  const chickenLeg = chickenCat.items.find((i) => i.item_id === 'chicken_leg');
  assertEqual(`[${brandId}] 치킨다리는 여전히 customize_steps 없음(고정가 유지)`, chickenLeg.customize_steps.length, 0);
});

// burgerking: 사이드 단독구매 카테고리 검증 (v1.3.4)
['burgerking'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const sidesCat = brand.menu.categories.find((c) => c.category_id === 'sides');
  assertEqual(`[${brandId}] 사이드 카테고리 존재`, !!sidesCat, true);
  assertEqual(`[${brandId}] 사이드 카테고리 아이템 6종`, sidesCat.items.length, 6);

  const fries = sidesCat.items.find((i) => i.item_id === 'fries_standalone');
  const sizeStep = fries.customize_steps.find((s) => s.step_id === 'size');
  assertEqual(`[${brandId}] 프렌치프라이 단독구매 사이즈 선택(R/L) 존재`, !!sizeStep, true);
  assertEqual(`[${brandId}] 프렌치프라이 R 선택 시 base_price 그대로`, computeItemUnitPrice(fries, { size: ['r'] }), fries.base_price);
  const lPrice = sizeStep.options.find((o) => o.option_id === 'l').price;
  assertEqual(`[${brandId}] 프렌치프라이 L 선택 시 추가금 반영`, computeItemUnitPrice(fries, { size: ['l'] }), fries.base_price + lPrice);

  const nugget = sidesCat.items.find((i) => i.item_id === 'nugget_king_standalone');
  const pieceStep = nugget.customize_steps.find((s) => s.step_id === 'piece_count');
  assertEqual(`[${brandId}] 너겟킹 단독구매 조각수 선택(4/8조각) 존재`, !!pieceStep, true);

  const onionRings = sidesCat.items.find((i) => i.item_id === 'onion_rings_standalone');
  assertEqual(`[${brandId}] 어니언링 단독구매는 customize_steps 없음(고정가)`, onionRings.customize_steps.length, 0);

  // 사이드 단독 구매 -> 장바구니 담기 (버거 없이도 가능한지)
  let cart = [];
  cart = addCartLine(cart, brand, { categoryId: 'sides', itemId: 'onion_rings_standalone', customizeSelections: {} });
  assertEqual(`[${brandId}] 버거 없이 사이드만 단독으로 장바구니 담기 가능`, computeCartTotal(cart), onionRings.base_price);
});

// all brands: item_id 브랜드 전체 고유성 회귀 (신규 아이템 추가 후)
['subway', 'burgerking', 'mcdonalds', 'lotteria', 'kfc'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const allItemIds = brand.menu.categories.flatMap((c) => c.items.map((i) => i.item_id));
  const uniqueIds = new Set(allItemIds);
  assertEqual(`[${brandId}] item_id 브랜드 전체 고유성 회귀`, uniqueIds.size, allItemIds.length);
});

// kfc: chicken 카테고리 flavor_mix (max_selections=2) 검증
['kfc'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const bucketItem = getItem(brand, 'chicken', 'chicken_bucket_9');
  const flavorStep = bucketItem.customize_steps.find((s) => s.step_id === 'flavor_mix');

  // 시나리오: 1개 선택 시 해당 옵션 가격만 반영
  const oneFlavor = { flavor_mix: ['original'] };
  assertEqual(`[${brandId}] flavor_mix 1개 선택 시 해당 옵션 가격만 반영`, computeItemUnitPrice(bucketItem, oneFlavor), bucketItem.base_price);

  // 시나리오: 2개 선택(반반) 시 두 옵션 가격 합산
  const twoFlavors = { flavor_mix: ['original', 'black_label'] };
  const blackLabelPrice = flavorStep.options.find((o) => o.option_id === 'black_label').price;
  assertEqual(`[${brandId}] flavor_mix 2개 선택(반반) 시 두 옵션 가격 합산`, computeItemUnitPrice(bucketItem, twoFlavors), bucketItem.base_price + blackLabelPrice);

  // 시나리오: 3번째 선택 시도 시 max_selections=2 캡 차단
  let sel = [];
  flavorStep.options.slice(0, 3).forEach((opt) => { sel = toggleOption(flavorStep, sel, opt.option_id); });
  assertEqual(`[${brandId}] flavor_mix 3번째 선택 시도 시 max_selections=2 캡 차단`, sel.length, 2);
});

// subway: required:false 스텝(추가토핑/야채/소스)은 0개 선택으로도 진행 가능, KFC flavor_mix는 여전히 필수
['subway'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const firstItem = brand.menu.categories[0].items[0];
  ['extra_toppings', 'vegetables', 'sauce'].forEach((stepId) => {
    const step = firstItem.customize_steps.find((s) => s.step_id === stepId);
    assertEqual(`[${brandId}] ${stepId} required:false 명시됨`, step.required, false);
    assertEqual(`[${brandId}] ${stepId} 0개 선택 상태에서도 진행 가능(canProceedCustomize)`, canProceedCustomize(step, []), true);
  });
  const breadStep = firstItem.customize_steps.find((s) => s.step_id === 'bread');
  assertEqual(`[${brandId}] bread(필수 단계)는 required 필드 없음(기본값 true로 동작)`, breadStep.required, undefined);
  assertEqual(`[${brandId}] bread 0개 선택 상태에서는 진행 불가`, canProceedCustomize(breadStep, []), false);
});
['kfc'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const bucketItem = getItem(brand, 'chicken', 'chicken_bucket_9');
  const flavorStep = bucketItem.customize_steps.find((s) => s.step_id === 'flavor_mix');
  assertEqual(`[${brandId}] flavor_mix는 required:false 없음(맛 최소 1개는 필수)`, flavorStep.required, undefined);
  assertEqual(`[${brandId}] flavor_mix 0개 선택 상태에서는 진행 불가`, canProceedCustomize(flavorStep, []), false);
});

// 단독 음료(drinks/mccafe 카테고리) 사이즈 선택 검증 (v1.3.2)
[
  { brandId: 'burgerking', hasSize: ['coke_standalone', 'sprite_standalone'], noSize: ['ice_americano_standalone'] },
  { brandId: 'mcdonalds', hasSize: ['coke_standalone', 'sprite_standalone', 'ice_americano_standalone'], noSize: [] },
  { brandId: 'lotteria', hasSize: ['coke_standalone', 'sprite_standalone', 'ice_tea_standalone'], noSize: [] },
  { brandId: 'kfc', hasSize: ['coke_standalone', 'sprite_standalone', 'ice_americano_standalone'], noSize: [] },
].forEach(({ brandId, hasSize, noSize }) => {
  const brand = loadBrand(brandId);
  const drinksCat = brand.menu.categories.find((c) => c.category_id === 'drinks');
  hasSize.forEach((itemId) => {
    const item = drinksCat.items.find((i) => i.item_id === itemId);
    const sizeStep = item.customize_steps.find((s) => s.step_id === 'size');
    assertEqual(`[${brandId}] ${itemId} 사이즈 선택 단계 존재`, !!sizeStep, true);
    assertEqual(`[${brandId}] ${itemId} L사이즈 선택 시 가격 증가`, sizeStep.options.find((o) => o.option_id === 'l').price > 0, true);
  });
  noSize.forEach((itemId) => {
    const item = drinksCat.items.find((i) => i.item_id === itemId);
    assertEqual(`[${brandId}] ${itemId} 사이즈 선택 단계 없음(단일가 유지)`, item.customize_steps.length, 0);
  });
});

// 맥도날드 맥카페 3종 사이즈 선택 검증
['mcdonalds'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  const mccafeCat = brand.menu.categories.find((c) => c.category_id === 'mccafe');
  mccafeCat.items.forEach((item) => {
    const sizeStep = item.customize_steps.find((s) => s.step_id === 'size');
    assertEqual(`[${brandId}] mccafe ${item.item_id} 사이즈 선택 단계 존재`, !!sizeStep, true);
  });

  // 사이즈 선택에 따른 단가 계산 회귀
  const drinksCat = brand.menu.categories.find((c) => c.category_id === 'drinks');
  const coke = drinksCat.items.find((i) => i.item_id === 'coke_standalone');
  const lPrice = coke.customize_steps.find((s) => s.step_id === 'size').options.find((o) => o.option_id === 'l').price;
  assertEqual(`[${brandId}] 코카콜라 M 선택 시 base_price 그대로`, computeItemUnitPrice(coke, { size: ['m'] }), coke.base_price);
  assertEqual(`[${brandId}] 코카콜라 L 선택 시 base_price+사이즈업 가격`, computeItemUnitPrice(coke, { size: ['l'] }), coke.base_price + lPrice);
});

// all brands: dining_options 구조 검증
['subway', 'burgerking', 'mcdonalds', 'lotteria', 'kfc'].forEach((brandId) => {
  const brand = loadBrand(brandId);
  assertEqual(`[${brandId}] dining_options 구조 검증 (options.length === 2)`, brand.dining_options?.options?.length, 2);
  assertEqual(`[${brandId}] dining_options type === binary_choice`, brand.dining_options?.type, 'binary_choice');
});

console.log(`\n${pass}개 통과, ${failCount}개 실패`);
process.exit(failCount === 0 ? 0 : 1);
