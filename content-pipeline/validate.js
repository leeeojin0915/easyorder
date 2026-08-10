#!/usr/bin/env node
/**
 * 브랜드 콘텐츠 JSON 파일이 스키마 규칙을 지키는지 검사한다.
 * 사용법: node validate.js brands/subway.json [brands/other.json ...]
 * 인자를 안 주면 brands/ 폴더 안의 모든 *.json(단, _template.json 제외)을 검사한다.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ALLOWED_SHAPES = ['freestanding_totem', 'countertop_tablet', 'table_order', 'wall_mounted'];
const ALLOWED_ORIENTATIONS = ['portrait', 'landscape'];
const ALLOWED_CUSTOMIZE_STEP_TYPES = ['single_select', 'multi_select', 'binary_choice'];
const ALLOWED_ORDER_STEP_TYPES = ['confirm', 'payment_mock'];
const ALLOWED_VISUALS = ['bread', 'burger', 'drink', 'vegetable'];
const ALLOWED_CATEGORIES = ['fastfood_cafe', 'dessert_cafe', 'restaurant'];
const HEX_RE = /^#([0-9A-Fa-f]{6})$/;

function fail(errors, msg) { errors.push(msg); }

function validateOptions(step, loc, errors) {
  if (step.type === 'confirm') return;
  if (!Array.isArray(step.options) || step.options.length === 0) {
    fail(errors, `${loc}: options 가 없거나 비어있음 (confirm 타입이 아니면 필수)`);
    return;
  }
  const seenOptIds = new Set();
  step.options.forEach((opt, j) => {
    const oloc = `${loc}.options[${j}]`;
    if (!opt.option_id) fail(errors, `${oloc}: option_id 없음`);
    else if (seenOptIds.has(opt.option_id)) fail(errors, `${oloc}: option_id 중복`);
    else seenOptIds.add(opt.option_id);
    if (!opt.label) fail(errors, `${oloc}: label 없음`);
    if (opt.price !== undefined && typeof opt.price !== 'number') fail(errors, `${oloc}: price 는 숫자여야 함`);
    if (step.type === 'payment_mock' && !['card', 'phone', 'cash'].includes(opt.icon)) {
      fail(errors, `${oloc}: payment_mock 옵션은 icon(card|phone|cash) 필요`);
    }
  });
}

function validateCustomizeSteps(item, loc, errors) {
  if (!Array.isArray(item.customize_steps)) {
    fail(errors, `${loc}: customize_steps 는 배열이어야 함 (비어있어도 됨)`);
    return;
  }
  const seenStepIds = new Set();
  const stepById = {};
  item.customize_steps.forEach((s) => { if (s.step_id) stepById[s.step_id] = s; });

  item.customize_steps.forEach((step, i) => {
    const sloc = `${loc}.customize_steps[${i}](${step.step_id || '?'})`;
    if (!step.step_id) fail(errors, `${sloc}: step_id 없음`);
    else if (seenStepIds.has(step.step_id)) fail(errors, `${sloc}: step_id 중복`);
    else seenStepIds.add(step.step_id);

    if (!ALLOWED_CUSTOMIZE_STEP_TYPES.includes(step.type)) {
      fail(errors, `${sloc}: type 값이 허용 목록에 없음: "${step.type}" (customize_steps는 confirm/payment_mock 사용 불가)`);
    }
    if (!step.title) fail(errors, `${sloc}: title 없음`);
    if (!step.voice_text) fail(errors, `${sloc}: voice_text 없음`);
    if (step.visual !== undefined && !ALLOWED_VISUALS.includes(step.visual)) {
      fail(errors, `${sloc}: visual 값이 허용 목록에 없음: "${step.visual}"`);
    }

    if (step.max_selections !== undefined) {
      if (step.type !== 'multi_select') {
        fail(errors, `${sloc}: max_selections 는 multi_select 타입에서만 사용 가능`);
      } else if (!Number.isInteger(step.max_selections) || step.max_selections < 1 || step.max_selections > (step.options?.length || 0)) {
        fail(errors, `${sloc}: max_selections 는 1 이상 options.length 이하의 정수여야 함 (현재: ${step.max_selections})`);
      }
    }

    if (step.required !== undefined) {
      if (typeof step.required !== 'boolean') {
        fail(errors, `${sloc}: required 는 boolean 이어야 함`);
      } else if (step.required === false && step.type !== 'multi_select') {
        fail(errors, `${sloc}: required:false 는 multi_select 타입에서만 사용 가능 (single_select/binary_choice는 항상 하나를 선택해야 함)`);
      }
    }

    if (step.condition !== undefined) {
      const c = step.condition;
      if (!c || typeof c !== 'object' || !c.step_id || !c.option_id) {
        fail(errors, `${sloc}: condition은 {step_id, option_id} 형태여야 함`);
      } else {
        const refStep = stepById[c.step_id];
        if (!refStep) {
          fail(errors, `${sloc}: condition.step_id "${c.step_id}" 가 이 아이템의 customize_steps 안에 없음`);
        } else if (!refStep.options || !refStep.options.some((o) => o.option_id === c.option_id)) {
          fail(errors, `${sloc}: condition.option_id "${c.option_id}" 가 step "${c.step_id}"의 옵션에 없음`);
        }
      }
    }

    validateOptions(step, sloc, errors);
  });
}

function validateDiningOptions(data, errors) {
  if (!data.dining_options || typeof data.dining_options !== 'object') {
    fail(errors, 'dining_options 가 없음');
    return;
  }
  const d = data.dining_options;
  const loc = 'dining_options';
  if (!d.step_id) fail(errors, `${loc}: step_id 없음`);
  if (d.type !== 'binary_choice') fail(errors, `${loc}: type 은 binary_choice 여야 함 (현재: "${d.type}")`);
  if (!d.title) fail(errors, `${loc}: title 없음`);
  if (!d.voice_text) fail(errors, `${loc}: voice_text 없음`);
  if (!Array.isArray(d.options) || d.options.length < 2) {
    fail(errors, `${loc}: options 는 2개 이상이어야 함`);
  } else {
    validateOptions(d, loc, errors);
  }
}

function validateBrand(data, errors) {
  if (!data.brand_id || typeof data.brand_id !== 'string') fail(errors, 'brand_id 없음/형식 오류');
  else if (!/^[a-z0-9_]+$/.test(data.brand_id)) fail(errors, `brand_id는 소문자 영문/숫자/언더스코어만 허용: "${data.brand_id}"`);

  if (!data.brand_name) fail(errors, 'brand_name 없음');
  if (!ALLOWED_CATEGORIES.includes(data.category)) fail(errors, `category 값이 허용 목록에 없음: "${data.category}" (허용: ${ALLOWED_CATEGORIES.join(', ')})`);

  if (!data.device) { fail(errors, 'device 없음'); }
  else {
    if (!ALLOWED_SHAPES.includes(data.device.shape)) fail(errors, `device.shape 값이 허용 목록에 없음: "${data.device.shape}"`);
    if (!ALLOWED_ORIENTATIONS.includes(data.device.orientation)) fail(errors, `device.orientation 값이 허용 목록에 없음: "${data.device.orientation}"`);
    const theme = data.device.theme || {};
    ['bg', 'card', 'accent', 'text', 'mute'].forEach((k) => {
      if (!theme[k] || !HEX_RE.test(theme[k])) fail(errors, `device.theme.${k} 가 유효한 hex 색상이 아님: "${theme[k]}"`);
    });
  }

  if (!data.menu || !Array.isArray(data.menu.categories) || data.menu.categories.length === 0) {
    fail(errors, 'menu.categories 가 없거나 비어있음');
  } else {
    if (!data.menu.menu_id) fail(errors, 'menu.menu_id 없음');

    const seenCategoryIds = new Set();
    const seenItemIds = new Set();

    data.menu.categories.forEach((cat, ci) => {
      const cloc = `menu.categories[${ci}](${cat.category_id || '?'})`;
      if (!cat.category_id) fail(errors, `${cloc}: category_id 없음`);
      else if (seenCategoryIds.has(cat.category_id)) fail(errors, `${cloc}: category_id 중복`);
      else seenCategoryIds.add(cat.category_id);

      if (!cat.label) fail(errors, `${cloc}: label 없음`);

      if (!Array.isArray(cat.items) || cat.items.length === 0) {
        fail(errors, `${cloc}: items 가 없거나 비어있음`);
        return;
      }

      cat.items.forEach((item, ii) => {
        const iloc = `${cloc}.items[${ii}](${item.item_id || '?'})`;
        if (!item.item_id) fail(errors, `${iloc}: item_id 없음`);
        else if (seenItemIds.has(item.item_id)) fail(errors, `${iloc}: item_id 중복 (브랜드 전체에서 고유해야 함)`);
        else seenItemIds.add(item.item_id);

        if (!item.label) fail(errors, `${iloc}: label 없음`);
        if (typeof item.base_price !== 'number') fail(errors, `${iloc}: base_price 는 숫자여야 함`);
        if (item.visual !== undefined && !ALLOWED_VISUALS.includes(item.visual)) {
          fail(errors, `${iloc}: visual 값이 허용 목록에 없음: "${item.visual}"`);
        }

        validateCustomizeSteps(item, iloc, errors);
      });
    });
  }

  if (!Array.isArray(data.order_steps) || data.order_steps.length === 0) {
    fail(errors, 'order_steps 가 없거나 비어있음');
  } else {
    const types = data.order_steps.map((s) => s.type);
    if (types.length !== 2 || types[0] !== 'confirm' || types[1] !== 'payment_mock') {
      fail(errors, `order_steps 는 confirm 1개 다음 payment_mock 1개 순서여야 함 (현재: ${types.join(' -> ')})`);
    }
    data.order_steps.forEach((step, i) => {
      const oloc = `order_steps[${i}](${step.step_id || '?'})`;
      if (!step.step_id) fail(errors, `${oloc}: step_id 없음`);
      if (!ALLOWED_ORDER_STEP_TYPES.includes(step.type)) fail(errors, `${oloc}: type 값이 허용 목록에 없음: "${step.type}"`);
      if (!step.title) fail(errors, `${oloc}: title 없음`);
      if (!step.voice_text) fail(errors, `${oloc}: voice_text 없음`);
      validateOptions(step, oloc, errors);
    });
  }

  validateDiningOptions(data, errors);
}

function run(filePaths) {
  let allPassed = true;
  filePaths.forEach((filePath) => {
    const errors = [];
    let data;
    try {
      data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      console.log(`❌ ${filePath} — JSON 파싱 실패: ${e.message}`);
      allPassed = false;
      return;
    }
    validateBrand(data, errors);
    if (errors.length === 0) {
      console.log(`✅ ${filePath} — 통과`);
    } else {
      allPassed = false;
      console.log(`❌ ${filePath} — ${errors.length}개 오류`);
      errors.forEach((e) => console.log(`   - ${e}`));
    }
  });
  process.exit(allPassed ? 0 : 1);
}

let targets = process.argv.slice(2);
if (targets.length === 0) {
  const dir = path.join(__dirname, 'brands');
  targets = fs.readdirSync(dir)
    .filter((f) => f.endsWith('.json') && f !== '_template.json')
    .map((f) => path.join(dir, f));
}
run(targets);
