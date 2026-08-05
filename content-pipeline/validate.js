#!/usr/bin/env node
/**
 * 브랜드 콘텐츠 JSON 파일이 스키마 규칙을 지키는지 검사한다.
 * 사용법: node validate.js brands/subway.json [brands/other.json ...]
 * 인자를 안 주면 brands/ 폴더 안의 모든 *.json(단, _template.json 제외)을 검사한다.
 */
const fs = require('fs');
const path = require('path');

const ALLOWED_SHAPES = ['freestanding_totem', 'countertop_tablet', 'table_order', 'wall_mounted'];
const ALLOWED_ORIENTATIONS = ['portrait', 'landscape'];
const ALLOWED_STEP_TYPES = ['single_select', 'multi_select', 'binary_choice', 'confirm', 'payment_mock'];
const ALLOWED_VISUALS = ['bread', 'burger', 'drink', 'vegetable'];
const ALLOWED_CATEGORIES = ['fastfood_cafe', 'dessert_cafe', 'restaurant'];
const HEX_RE = /^#([0-9A-Fa-f]{6})$/;

function fail(errors, msg) { errors.push(msg); }

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

  if (!data.flow || !Array.isArray(data.flow.steps) || data.flow.steps.length === 0) {
    fail(errors, 'flow.steps 가 없거나 비어있음');
    return;
  }
  if (!data.flow.flow_id) fail(errors, 'flow.flow_id 없음');

  const seenStepIds = new Set();
  const stepById = {};
  data.flow.steps.forEach((s) => { if (s.step_id) stepById[s.step_id] = s; });

  data.flow.steps.forEach((step, i) => {
    const loc = `steps[${i}](${step.step_id || '?'})`;
    if (!step.step_id) fail(errors, `${loc}: step_id 없음`);
    else if (seenStepIds.has(step.step_id)) fail(errors, `${loc}: step_id 중복`);
    else seenStepIds.add(step.step_id);

    if (!ALLOWED_STEP_TYPES.includes(step.type)) fail(errors, `${loc}: type 값이 허용 목록에 없음: "${step.type}"`);
    if (!step.title) fail(errors, `${loc}: title 없음`);
    if (!step.voice_text) fail(errors, `${loc}: voice_text 없음`);
    if (step.visual !== undefined && !ALLOWED_VISUALS.includes(step.visual)) {
      fail(errors, `${loc}: visual 값이 허용 목록에 없음: "${step.visual}" (허용: ${ALLOWED_VISUALS.join(', ')})`);
    }

    if (step.condition !== undefined) {
      const c = step.condition;
      if (!c || typeof c !== 'object' || !c.step_id || !c.option_id) {
        fail(errors, `${loc}: condition은 {step_id, option_id} 형태여야 함`);
      } else {
        const refStep = stepById[c.step_id];
        if (!refStep) {
          fail(errors, `${loc}: condition.step_id "${c.step_id}" 가 이 flow 안에 없음`);
        } else if (!refStep.options || !refStep.options.some((o) => o.option_id === c.option_id)) {
          fail(errors, `${loc}: condition.option_id "${c.option_id}" 가 step "${c.step_id}"의 옵션에 없음`);
        }
      }
    }

    if (step.type !== 'confirm') {
      if (!Array.isArray(step.options) || step.options.length === 0) {
        fail(errors, `${loc}: options 가 없거나 비어있음 (confirm 타입이 아니면 필수)`);
      } else {
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
    }
  });
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
