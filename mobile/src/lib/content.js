import indexRegistry from '../../../content-pipeline/index.json';
import subway from '../../../content-pipeline/brands/subway.json';
import burgerking from '../../../content-pipeline/brands/burgerking.json';
import mcdonalds from '../../../content-pipeline/brands/mcdonalds.json';
import lotteria from '../../../content-pipeline/brands/lotteria.json';
import kfc from '../../../content-pipeline/brands/kfc.json';
import { BRAND_UI_META } from './brandMeta';

const RAW_BRANDS = { subway, burgerking, mcdonalds, lotteria, kfc };

function adapt(json, uiMeta) {
  return {
    store: { name: json.store_example.name, sub: json.store_example.sub, icon: uiMeta.icon, iconBg: uiMeta.iconBg },
    device: json.device,
    dining_options: json.dining_options,
    menu: json.menu,
    order_steps: json.order_steps,
  };
}

export const CONTENT = indexRegistry.brands
  .filter((b) => b.status === 'live')
  .reduce((acc, b) => {
    const json = RAW_BRANDS[b.brand_id];
    const uiMeta = BRAND_UI_META[b.brand_id];
    if (json && uiMeta) acc[b.brand_id] = adapt(json, uiMeta);
    return acc;
  }, {});

export function phaseIndexForScreen(screen) {
  if (screen === 'diningOption') return 0;
  if (screen === 'category' || screen === 'itemCustomize') return 1;
  if (screen === 'cartReview') return 2;
  if (screen === 'payment') return 3;
  if (screen === 'complete') return 4;
  return 0;
}

export function getCategories(brandId) {
  return CONTENT[brandId].menu.categories;
}
export function getItem(brandId, categoryId, itemId) {
  const cat = getCategories(brandId).find((c) => c.category_id === categoryId);
  return cat.items.find((i) => i.item_id === itemId);
}

export function itemStepVisible(step, itemSelections) {
  if (!step.condition) return true;
  const chosen = itemSelections[step.condition.step_id] || [];
  return chosen.includes(step.condition.option_id);
}
export function visibleCustomizeSteps(item, itemSelections) {
  return item.customize_steps.filter((s) => itemStepVisible(s, itemSelections));
}
export function isStepAtSelectionCap(step, currentSelection) {
  return step.max_selections !== undefined && currentSelection.length >= step.max_selections;
}
export function computeItemUnitPrice(item, itemSelections) {
  let total = item.base_price || 0;
  visibleCustomizeSteps(item, itemSelections).forEach((s) => {
    (itemSelections[s.step_id] || []).forEach((oid) => {
      const opt = s.options.find((o) => o.option_id === oid);
      if (opt?.price) total += opt.price;
    });
  });
  return total;
}
export function computeCartTotal(cart) {
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
function optionLabelsFor(item, itemSelections) {
  const labels = [];
  visibleCustomizeSteps(item, itemSelections).forEach((s) => {
    (itemSelections[s.step_id] || []).forEach((oid) => {
      const opt = s.options.find((o) => o.option_id === oid);
      if (opt) labels.push(opt.label);
    });
  });
  return labels;
}
export function addCartLine(cart, brandId, { categoryId, itemId, customizeSelections }) {
  const item = getItem(brandId, categoryId, itemId);
  const unitPrice = computeItemUnitPrice(item, customizeSelections);
  const optionLabels = optionLabelsFor(item, customizeSelections);
  const existing = cart.find((l) => l.itemId === itemId && selectionsEqual(l.customizeSelections, customizeSelections));
  if (existing) {
    return cart.map((l) => (l === existing ? { ...l, qty: l.qty + 1, lineTotal: unitPrice * (l.qty + 1) } : l));
  }
  const cartItemId = `${itemId}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  return [...cart, { cartItemId, categoryId, itemId, label: item.label, customizeSelections, optionLabels, unitPrice, qty: 1, lineTotal: unitPrice }];
}
export function removeCartLine(cart, cartItemId) {
  return cart.filter((l) => l.cartItemId !== cartItemId);
}
export function cartSummaryLine(cart) {
  return cart.map((l) => {
    const opts = l.optionLabels.length ? `(${l.optionLabels.join(', ')})` : '';
    const qty = l.qty > 1 ? ` x${l.qty}` : '';
    return `${l.label}${opts}${qty}`;
  }).join(' · ');
}
export function priceLabel(step, price) {
  if (step.priceMode === 'absolute') return `${price.toLocaleString()}원`;
  return `+${price.toLocaleString()}원`;
}
