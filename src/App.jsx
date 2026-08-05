import React, { useState, useEffect } from 'react';
import { storage } from './lib/storage';
import {
  Search, Home as HomeIcon, List, Settings as SettingsIcon, Heart, ChevronRight,
  Volume2, VolumeX, RotateCcw, User, CreditCard, Smartphone, Banknote,
  Check, ArrowLeft, Sandwich, Utensils, Trash2, Type, Eye, ClipboardCheck,
} from 'lucide-react';

/* ---------------------------------------------------------------
   콘텐츠 데이터: content-pipeline/brands/*.json 의 내용을 그대로 옮긴 것.
   (실제 앱에서는 이 객체 대신 그 JSON 파일들을 서버에서 fetch 해서 채운다)
--------------------------------------------------------------- */
const CONTENT = {
  subway: {
    store: { name: '서브웨이 강남점', sub: '도보 3분 · 키오스크 주문', icon: Sandwich, iconBg: '#0F6E56' },
    basePrice: 7900,
    device: {
      shape: 'freestanding_totem', orientation: 'portrait',
      theme: { bg: '#F7F3EA', card: '#FFFFFF', accent: '#0F6E56', text: '#232E28', mute: '#8A9089' },
    },
    flow: { flow_id: 'subway_default_v1', steps: [
      { step_id: 'bread', type: 'single_select', priceMode: 'delta', visual: 'bread', title: '빵 종류를 선택하세요', voice_text: '먼저 빵 종류를 골라주세요.',
        options: [{ option_id: 'white', label: '화이트빵', price: 0 }, { option_id: 'wheat', label: '위트빵', price: 0 }, { option_id: 'italian', label: '이탈리안 빵', price: 0 }] },
      { step_id: 'toast', type: 'binary_choice', priceMode: 'delta', title: '빵을 데워드릴까요?', voice_text: '빵을 따뜻하게 데워드릴지 선택해주세요.',
        options: [{ option_id: 'yes', label: '네, 데워주세요', price: 0 }, { option_id: 'no', label: '아니요', price: 0 }] },
      { step_id: 'vegetables', type: 'multi_select', priceMode: 'delta', visual: 'vegetable', title: '야채를 선택하세요', voice_text: '원하는 야채를 모두 골라주세요.',
        options: [{ option_id: 'lettuce', label: '양상추', price: 0 }, { option_id: 'tomato', label: '토마토', price: 0 }, { option_id: 'onion', label: '양파', price: 0 }, { option_id: 'pickle', label: '피클', price: 0 }] },
      { step_id: 'confirm_order', type: 'confirm', title: '선택하신 내용을 확인해주세요', voice_text: '지금까지 고르신 내용이 맞는지 확인해주세요.' },
      { step_id: 'payment', type: 'payment_mock', title: '결제 방법을 선택하세요', voice_text: '결제 방법을 선택해주세요.',
        options: [{ option_id: 'card', label: '카드 삽입', icon: 'card' }, { option_id: 'phone', label: '휴대폰 태그', icon: 'phone' }, { option_id: 'cash', label: '현금', icon: 'cash' }] },
    ] },
  },
  burgerking: {
    store: { name: '버거킹 홍대점', sub: '도보 5분 · 키오스크 주문', icon: Utensils, iconBg: '#C1502B' },
    basePrice: 0,
    device: {
      shape: 'countertop_tablet', orientation: 'landscape',
      theme: { bg: '#241B17', card: '#332822', accent: '#E4592D', text: '#FFFFFF', mute: '#B9ACA5' },
    },
    flow: { flow_id: 'burgerking_default_v1', steps: [
      { step_id: 'menu', type: 'single_select', priceMode: 'absolute', visual: 'burger', title: '메뉴를 선택하세요', voice_text: '주문하실 버거를 골라주세요.',
        options: [{ option_id: 'whopper', label: '와퍼', price: 7900 }, { option_id: 'cheese', label: '치즈버거', price: 6900 }, { option_id: 'chicken', label: '치킨버거', price: 7500 }] },
      { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '단품과 세트 중 골라주세요.',
        options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2000 }, { option_id: 'single', label: '아니요, 단품으로', price: 0 }] },
      { step_id: 'confirm_order', type: 'confirm', title: '선택하신 내용을 확인해주세요', voice_text: '지금까지 고르신 내용이 맞는지 확인해주세요.' },
      { step_id: 'payment', type: 'payment_mock', title: '결제 방법을 선택하세요', voice_text: '결제 방법을 선택해주세요.',
        options: [{ option_id: 'card', label: '카드 삽입', icon: 'card' }, { option_id: 'phone', label: '휴대폰 태그', icon: 'phone' }, { option_id: 'cash', label: '현금', icon: 'cash' }] },
    ] },
  },
  mcdonalds: {
    store: { name: '맥도날드 종로점', sub: '도보 4분 · 키오스크 주문', icon: Utensils, iconBg: '#C62828' },
    basePrice: 0,
    device: {
      shape: 'freestanding_totem', orientation: 'portrait',
      theme: { bg: '#FFFBF2', card: '#FFFFFF', accent: '#C62828', text: '#2A211B', mute: '#9A8F84' },
    },
    flow: { flow_id: 'mcdonalds_default_v1', steps: [
      { step_id: 'menu', type: 'single_select', priceMode: 'absolute', visual: 'burger', title: '메뉴를 선택하세요', voice_text: '주문하실 버거를 골라주세요.',
        options: [{ option_id: 'bigmac', label: '빅맥', price: 5700 }, { option_id: 'shanghai', label: '맥스파이시 상하이 버거', price: 5200 }, { option_id: 'bulgogi', label: '불고기버거', price: 3800 }] },
      { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '세트로 하시면 감자튀김과 음료가 같이 나와요.',
        options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 1900 }, { option_id: 'single', label: '아니요, 버거만 주세요', price: 0 }] },
      { step_id: 'drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' }, title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
        options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_americano', label: '아이스 아메리카노', price: 300 }] },
      { step_id: 'confirm_order', type: 'confirm', title: '선택하신 내용을 확인해주세요', voice_text: '지금까지 고르신 내용이 맞는지 확인해주세요.' },
      { step_id: 'payment', type: 'payment_mock', title: '결제 방법을 선택하세요', voice_text: '결제 방법을 선택해주세요.',
        options: [{ option_id: 'card', label: '카드 삽입', icon: 'card' }, { option_id: 'phone', label: '휴대폰 태그', icon: 'phone' }, { option_id: 'cash', label: '현금', icon: 'cash' }] },
    ] },
  },
  lotteria: {
    store: { name: '롯데리아 신촌점', sub: '도보 2분 · 키오스크 주문', icon: Utensils, iconBg: '#D84315' },
    basePrice: 0,
    device: {
      shape: 'countertop_tablet', orientation: 'landscape',
      theme: { bg: '#FBEFE4', card: '#FFFFFF', accent: '#D84315', text: '#2B211C', mute: '#B08D75' },
    },
    flow: { flow_id: 'lotteria_default_v1', steps: [
      { step_id: 'menu', type: 'single_select', priceMode: 'absolute', visual: 'burger', title: '메뉴를 선택하세요', voice_text: '주문하실 버거를 골라주세요.',
        options: [{ option_id: 'classic_cheese', label: '클래식치즈버거', price: 5700 }, { option_id: 'ria_bulgogi', label: '리아 불고기', price: 5100 }, { option_id: 'ria_shrimp', label: '리아 새우', price: 5100 }] },
      { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '세트로 하시면 감자튀김과 음료가 같이 나와요.',
        options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2000 }, { option_id: 'single', label: '아니요, 버거만 주세요', price: 0 }] },
      { step_id: 'drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' }, title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
        options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_tea', label: '아이스티', price: 300 }] },
      { step_id: 'confirm_order', type: 'confirm', title: '선택하신 내용을 확인해주세요', voice_text: '지금까지 고르신 내용이 맞는지 확인해주세요.' },
      { step_id: 'payment', type: 'payment_mock', title: '결제 방법을 선택하세요', voice_text: '결제 방법을 선택해주세요.',
        options: [{ option_id: 'card', label: '카드 삽입', icon: 'card' }, { option_id: 'phone', label: '휴대폰 태그', icon: 'phone' }, { option_id: 'cash', label: '현금', icon: 'cash' }] },
    ] },
  },
  kfc: {
    store: { name: 'KFC 신림점', sub: '도보 6분 · 키오스크 주문', icon: Utensils, iconBg: '#E63946' },
    basePrice: 0,
    device: {
      shape: 'freestanding_totem', orientation: 'portrait',
      theme: { bg: '#241012', card: '#3A1518', accent: '#E63946', text: '#FFFFFF', mute: '#C9A9A9' },
    },
    flow: { flow_id: 'kfc_default_v1', steps: [
      { step_id: 'menu', type: 'single_select', priceMode: 'absolute', visual: 'burger', title: '메뉴를 선택하세요', voice_text: '주문하실 버거를 골라주세요.',
        options: [{ option_id: 'tower', label: '타워버거', price: 7900 }, { option_id: 'original_chicken', label: '오리지널 치킨버거', price: 4900 }, { option_id: 'zinger', label: '징거버거', price: 6700 }] },
      { step_id: 'set', type: 'binary_choice', priceMode: 'delta', title: '세트로 하시겠어요?', voice_text: '세트로 하시면 사이드와 음료가 같이 나와요.',
        options: [{ option_id: 'set', label: '네, 세트로 주세요', price: 2200 }, { option_id: 'single', label: '아니요, 버거만 주세요', price: 0 }] },
      { step_id: 'drink', type: 'single_select', priceMode: 'delta', visual: 'drink', condition: { step_id: 'set', option_id: 'set' }, title: '세트 음료를 선택하세요', voice_text: '세트에 포함된 음료를 골라주세요.',
        options: [{ option_id: 'coke', label: '코카콜라', price: 0 }, { option_id: 'sprite', label: '스프라이트', price: 0 }, { option_id: 'ice_americano', label: '아이스 아메리카노', price: 300 }] },
      { step_id: 'confirm_order', type: 'confirm', title: '선택하신 내용을 확인해주세요', voice_text: '지금까지 고르신 내용이 맞는지 확인해주세요.' },
      { step_id: 'payment', type: 'payment_mock', title: '결제 방법을 선택하세요', voice_text: '결제 방법을 선택해주세요.',
        options: [{ option_id: 'card', label: '카드 삽입', icon: 'card' }, { option_id: 'phone', label: '휴대폰 태그', icon: 'phone' }, { option_id: 'cash', label: '현금', icon: 'cash' }] },
    ] },
  },
};

const PHASES = ['매장선택', '메뉴선택', '주문확인', '결제하기', '결제완료'];
function phaseIndexForType(type) {
  if (type === 'confirm') return 2;
  if (type === 'payment_mock') return 3;
  return 1;
}
function stepVisible(s, sel) {
  if (!s.condition) return true;
  const chosen = sel[s.condition.step_id] || [];
  return chosen.includes(s.condition.option_id);
}
function visibleSteps(brandId, sel) {
  return CONTENT[brandId].flow.steps.filter((s) => stepVisible(s, sel));
}
function computeTotal(brandId, sel) {
  const b = CONTENT[brandId];
  let total = b.basePrice || 0;
  visibleSteps(brandId, sel).forEach((s) => {
    if (!s.options || s.type === 'payment_mock') return;
    (sel[s.step_id] || []).forEach((oid) => {
      const opt = s.options.find((o) => o.option_id === oid);
      if (opt?.price) total += opt.price;
    });
  });
  return total;
}

const APP = {
  bg: '#F4F6F2', surface: '#FFFFFF', ink: '#232E28', inkSoft: '#5C6960', border: '#DFE5DC',
  practice: '#0F6E56', practiceSoft: '#E1F0EA', realtime: '#C1502B', realtimeSoft: '#FBEAE3', highlight: '#E8A33D',
};
const APP_HC = {
  bg: '#FFFFFF', surface: '#FFFFFF', ink: '#000000', inkSoft: '#3A3A3A', border: '#8A9089',
  practice: '#0B5A46', practiceSoft: '#CFEBDF', realtime: '#9E3A1C', realtimeSoft: '#F6D2C2', highlight: '#B9790A',
};

function PaymentIcon({ icon, style }) {
  if (icon === 'card') return <CreditCard style={style} />;
  if (icon === 'phone') return <Smartphone style={style} />;
  return <Banknote style={style} />;
}

function FoodIcon({ visual, style }) {
  const common = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', style };
  if (visual === 'bread') {
    return (
      <svg {...common}>
        <path d="M3 15c0-5 4-9 9-9s9 4 9 9" />
        <path d="M3 15c0 2 1.3 3 3 3h12c1.7 0 3-1 3-3" />
        <line x1="3" y1="15" x2="21" y2="15" />
        <circle cx="9" cy="9.5" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="12" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="15" cy="9.5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (visual === 'burger') {
    return (
      <svg {...common}>
        <path d="M4 10c0-4 3.6-7 8-7s8 3 8 7" />
        <line x1="3" y1="10.5" x2="21" y2="10.5" />
        <line x1="3" y1="13.5" x2="21" y2="13.5" />
        <path d="M3 16.5h18" />
        <path d="M3 16.5c0 2 1.3 3 3 3h12c1.7 0 3-1 3-3" />
      </svg>
    );
  }
  if (visual === 'drink') {
    return (
      <svg {...common}>
        <path d="M7 8h10l-1.1 11.5A2 2 0 0 1 13.9 21h-3.8a2 2 0 0 1-2-1.5L7 8Z" />
        <path d="M6 8h12" />
        <path d="M14 8V3" />
        <path d="M14 3h3" />
      </svg>
    );
  }
  if (visual === 'vegetable') {
    return (
      <svg {...common}>
        <path d="M5 19c-2-6 1-13 8-15 3 5 3 12-2 15-2 1-4 1-6 0Z" />
        <path d="M6 18c3-4 6-7 11-13" />
      </svg>
    );
  }
  return <Utensils style={style} />;
}

function Button({ children, onClick, variant = 'default', disabled, style, app }) {
  const base = {
    height: 48, borderRadius: 12, fontSize: 15, fontWeight: 500,
    border: '1px solid ' + app.border, background: app.surface, color: app.ink,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1,
  };
  const variants = {
    primary: { background: app.ink, color: '#fff', border: 'none' },
    realtime: { background: app.realtime, color: '#fff', border: 'none' },
    outlineRealtime: { color: app.realtime, border: '1px solid ' + app.realtime },
    ghost: { background: 'transparent', border: 'none', color: app.inkSoft },
  };
  return (
    <button onClick={disabled ? undefined : onClick} style={{ ...base, ...(variants[variant] || {}), ...style }}>
      {children}
    </button>
  );
}

function StepTracker({ theme, currentPhase }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '12px 12px 8px', overflowX: 'auto' }}>
      {PHASES.map((label, i) => {
        const state = i < currentPhase ? 'done' : i === currentPhase ? 'current' : 'upcoming';
        return (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, flexShrink: 0 }}>
              <div style={{
                width: 15, height: 15, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 8, fontWeight: 700, flexShrink: 0,
                background: state === 'upcoming' ? theme.mute + '33' : theme.accent,
                color: state === 'upcoming' ? theme.mute : '#fff',
              }}>
                {state === 'done' ? <Check style={{ width: 9, height: 9 }} /> : i + 1}
              </div>
              <span style={{ fontSize: 9, color: state === 'current' ? theme.text : theme.mute, fontWeight: state === 'current' ? 700 : 400, whiteSpace: 'nowrap' }}>{label}</span>
            </div>
            {i < PHASES.length - 1 && <ChevronRight style={{ width: 10, height: 10, color: theme.mute, flexShrink: 0 }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const STORAGE_SETTINGS_KEY = 'easyorder:settings';
const STORAGE_ORDERS_KEY = 'easyorder:saved_orders';

export default function App() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState('home');
  const [brandId, setBrandId] = useState('subway');
  const [mode, setMode] = useState('practice');
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState({});
  const [calledStaff, setCalledStaff] = useState(false);
  const [nickname, setNickname] = useState('');
  const [savedThisRun, setSavedThisRun] = useState(false);
  const [savedOrders, setSavedOrders] = useState([]);
  const [settings, setSettings] = useState({ fontScale: 1, voiceOn: true, highContrast: false });

  useEffect(() => {
    (async () => {
      try {
        const s = await storage.get(STORAGE_SETTINGS_KEY, false);
        if (s?.value) setSettings(JSON.parse(s.value));
      } catch (e) {}
      try {
        const o = await storage.get(STORAGE_ORDERS_KEY, false);
        if (o?.value) setSavedOrders(JSON.parse(o.value));
      } catch (e) {}
      setReady(true);
    })();
  }, []);

  async function updateSettings(patch) {
    const next = { ...settings, ...patch };
    setSettings(next);
    try { await storage.set(STORAGE_SETTINGS_KEY, JSON.stringify(next), false); } catch (e) {}
  }
  async function persistOrders(next) {
    setSavedOrders(next);
    try { await storage.set(STORAGE_ORDERS_KEY, JSON.stringify(next), false); } catch (e) {}
  }
  async function saveCurrentOrder() {
    const brand = CONTENT[brandId];
    const entry = {
      id: `${brandId}_${Date.now()}`, brandId, storeName: brand.store.name,
      nickname: nickname.trim() || `${brand.store.name} 조합`, selections, createdAt: new Date().toISOString(),
    };
    await persistOrders([entry, ...savedOrders]);
    setSavedThisRun(true);
  }
  async function deleteOrder(id) { await persistOrders(savedOrders.filter((o) => o.id !== id)); }

  const app = settings.highContrast ? APP_HC : APP;
  const fs = (px) => Math.round(px * settings.fontScale);
  const brand = CONTENT[brandId];
  const steps = visibleSteps(brandId, selections);
  const device = brand.device;
  const theme = device.theme;
  const step = steps[stepIndex];
  const isLast = stepIndex === steps.length - 1;
  const currentSelection = step ? (selections[step.step_id] || []) : [];
  const isConfirmStep = step?.type === 'confirm';
  const isPriceStep = step?.type === 'confirm' || step?.type === 'payment_mock';
  const canProceed = isConfirmStep || currentSelection.length > 0;
  const total = computeTotal(brandId, selections);

  function toggleOption(optId) {
    setSelections((prev) => {
      const cur = prev[step.step_id] || [];
      if (step.type === 'multi_select') {
        return { ...prev, [step.step_id]: cur.includes(optId) ? cur.filter((o) => o !== optId) : [...cur, optId] };
      }
      return { ...prev, [step.step_id]: [optId] };
    });
  }
  function goNext() { isLast ? setScreen('complete') : setStepIndex((i) => i + 1); }
  function goBack() { stepIndex === 0 ? setScreen('mode') : setStepIndex((i) => i - 1); }
  function startFlow(m) {
    setMode(m); setStepIndex(0); setSelections({}); setCalledStaff(false);
    setSavedThisRun(false); setNickname(''); setScreen('flow');
  }
  function pickStore(id) { setBrandId(id); setScreen('mode'); }

  function summaryLine(bId, sel) {
    return visibleSteps(bId, sel).filter((s) => s.options)
      .map((s) => (sel[s.step_id] || []).map((oid) => s.options.find((o) => o.option_id === oid)?.label).join(', '))
      .filter(Boolean).join(' · ');
  }
  function priceLabel(step, price) {
    if (step.priceMode === 'absolute') return `${price.toLocaleString()}원`;
    return `+${price.toLocaleString()}원`;
  }

  const font = { fontFamily: "'Poppins','Pretendard',-apple-system,sans-serif" };
  const isImmersive = screen === 'flow' && mode === 'practice';
  const showTabs = ['home', 'orders', 'settings'].includes(screen);

  // 방어 코드: condition으로 화면이 늘거나 줄 때 stepIndex가 범위를 벗어나지 않게 보정
  useEffect(() => {
    if (steps.length > 0 && stepIndex > steps.length - 1) {
      setStepIndex(steps.length - 1);
    }
  }, [steps.length, stepIndex]);

  if (!ready) {
    return (
      <div style={{ background: app.bg, minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center', ...font }}>
        <span style={{ fontSize: 14, color: app.inkSoft }}>불러오는 중…</span>
      </div>
    );
  }

  return (
    <div style={{ background: app.bg, minHeight: 480, display: 'flex', justifyContent: 'center', padding: '24px 0', ...font }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600&display=swap');`}</style>
      <div style={{ width: 360, background: isImmersive ? theme.bg : app.surface, borderRadius: 28, border: '1px solid ' + app.border, overflow: 'hidden', minHeight: 640, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative' }}>

          {screen === 'home' && (
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: fs(20), fontWeight: 600, color: app.ink, marginBottom: 16 }}>안녕하세요</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: app.bg, borderRadius: 12, padding: '12px 14px', marginBottom: 20, border: settings.highContrast ? '1px solid ' + app.border : 'none' }}>
                <Search style={{ width: 18, height: 18, color: app.inkSoft }} />
                <span style={{ fontSize: fs(14), color: app.inkSoft }}>매장 이름으로 검색</span>
              </div>
              <div style={{ fontSize: fs(13), color: app.inkSoft, marginBottom: 8 }}>가까운 매장</div>
              {Object.entries(CONTENT).map(([id, b]) => {
                const Icon = b.store.icon;
                return (
                  <div key={id} onClick={() => pickStore(id)}
                    style={{ display: 'flex', alignItems: 'center', gap: 12, background: app.bg, borderRadius: 16, padding: 16, marginBottom: 12, cursor: 'pointer', border: settings.highContrast ? '1px solid ' + app.border : 'none' }}>
                    <div style={{ width: 46, height: 46, borderRadius: 12, background: b.store.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon style={{ width: 24, height: 24, color: '#fff' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: fs(16), fontWeight: 600, color: app.ink }}>{b.store.name}</div>
                      <div style={{ fontSize: fs(12), color: app.inkSoft }}>{b.store.sub}</div>
                    </div>
                    <ChevronRight style={{ width: 18, height: 18, color: app.inkSoft }} />
                  </div>
                );
              })}
              {savedOrders.length > 0 && (
                <>
                  <div style={{ fontSize: fs(13), color: app.inkSoft, margin: '8px 0' }}>저장된 내 주문</div>
                  <div onClick={() => setScreen('orders')} style={{ display: 'flex', alignItems: 'center', gap: 10, background: app.bg, borderRadius: 12, padding: 14, cursor: 'pointer', border: settings.highContrast ? '1px solid ' + app.border : 'none' }}>
                    <Heart style={{ width: 18, height: 18, color: app.highlight }} />
                    <span style={{ fontSize: fs(14), color: app.ink }}>{savedOrders[0].nickname} 외 {Math.max(savedOrders.length - 1, 0)}개</span>
                  </div>
                </>
              )}
            </div>
          )}

          {screen === 'mode' && (
            <div style={{ padding: 20 }}>
              <ArrowLeft onClick={() => setScreen('home')} style={{ width: 20, height: 20, color: app.inkSoft, cursor: 'pointer', marginBottom: 20 }} />
              <div style={{ fontSize: fs(19), fontWeight: 600, color: app.ink, marginBottom: 4 }}>{brand.store.name}</div>
              <div style={{ fontSize: fs(13), color: app.inkSoft, marginBottom: 28 }}>어떻게 도와드릴까요?</div>
              <div onClick={() => startFlow('practice')} style={{ background: app.practiceSoft, borderRadius: 18, padding: 20, marginBottom: 14, cursor: 'pointer' }}>
                <div style={{ fontSize: fs(16), fontWeight: 600, color: app.practice, marginBottom: 4 }}>연습하기</div>
                <div style={{ fontSize: fs(13), color: app.ink }}>화면이 이 매장 기계와 똑같이 바뀌어요</div>
              </div>
              <div onClick={() => startFlow('realtime')} style={{ background: app.realtimeSoft, borderRadius: 18, padding: 20, cursor: 'pointer' }}>
                <div style={{ fontSize: fs(16), fontWeight: 600, color: app.realtime, marginBottom: 4 }}>지금 매장이에요</div>
                <div style={{ fontSize: fs(13), color: app.ink }}>키오스크 앞에서 실시간으로 안내받아요</div>
              </div>
            </div>
          )}

          {isImmersive && step && (
            <div style={{ minHeight: 640, display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, paddingTop: 8 }}>
                <ArrowLeft onClick={() => setScreen('mode')} style={{ width: 18, height: 18, color: theme.mute, cursor: 'pointer', flexShrink: 0, marginLeft: 10 }} />
                <div style={{ flex: 1 }}><StepTracker theme={theme} currentPhase={phaseIndexForType(step.type)} /></div>
              </div>

              <div style={{ padding: '4px 20px 190px', flex: 1 }}>
                <div style={{ fontSize: fs(19), fontWeight: 600, color: theme.text, marginBottom: 16 }}>{step.title}</div>

                {step.type === 'confirm' ? (
                  <div style={{ background: theme.card, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {steps.filter((s) => s.options && s.step_id !== step.step_id).map((s) => {
                      const ids = selections[s.step_id] || [];
                      if (ids.length === 0) return null;
                      return ids.map((oid) => {
                        const opt = s.options.find((o) => o.option_id === oid);
                        if (!opt) return null;
                        return (
                          <div key={s.step_id + oid} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                            <span style={{ fontSize: fs(14), color: theme.text }}>{opt.label}</span>
                            <span style={{ fontSize: fs(13), color: theme.mute }}>{priceLabel(s, opt.price || 0)}</span>
                          </div>
                        );
                      });
                    })}
                  </div>
                ) : step.type === 'payment_mock' ? (
                  <>
                    <div style={{ fontSize: fs(13), color: theme.mute, marginBottom: 14 }}>결제 금액 <b style={{ color: theme.text }}>{total.toLocaleString()}원</b></div>
                    <div style={{ display: 'grid', gridTemplateColumns: device.orientation === 'landscape' ? '1fr 1fr' : '1fr', gap: 10 }}>
                      {step.options.map((opt) => {
                        const selected = currentSelection.includes(opt.option_id);
                        return (
                          <div key={opt.option_id} onClick={() => toggleOption(opt.option_id)}
                            style={{ background: selected ? theme.accent : theme.card, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', border: selected ? 'none' : `1px solid ${theme.mute}44` }}>
                            <span style={{ color: selected ? '#fff' : theme.text }}><PaymentIcon icon={opt.icon} style={{ width: 20, height: 20 }} /></span>
                            <span style={{ fontSize: fs(15), fontWeight: selected ? 600 : 500, color: selected ? '#fff' : theme.text }}>{opt.label}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ marginTop: 12, fontSize: fs(11), color: theme.mute }}>연습 모드입니다. 실제 결제는 진행되지 않아요.</div>
                  </>
                ) : step.type === 'binary_choice' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {step.options.map((opt) => {
                      const selected = currentSelection.includes(opt.option_id);
                      return (
                        <div key={opt.option_id} onClick={() => toggleOption(opt.option_id)}
                          style={{ background: selected ? theme.accent : theme.card, borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: selected ? 'none' : `1px solid ${theme.mute}44` }}>
                          <span style={{ fontSize: fs(15), fontWeight: selected ? 600 : 500, color: selected ? '#fff' : theme.text }}>{opt.label}</span>
                          {opt.price > 0 && <span style={{ fontSize: fs(12), color: selected ? '#fff' : theme.mute }}>{priceLabel(step, opt.price)}</span>}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: device.orientation === 'landscape' ? '1fr 1fr 1fr' : (step.options.length > 3 ? '1fr 1fr' : '1fr 1fr 1fr'), gap: 10 }}>
                    {step.options.map((opt) => {
                      const selected = currentSelection.includes(opt.option_id);
                      return (
                        <div key={opt.option_id} onClick={() => toggleOption(opt.option_id)}
                          style={{ background: theme.card, borderRadius: 12, padding: 10, textAlign: 'center', cursor: 'pointer', border: selected ? `2px solid ${theme.accent}` : `1px solid ${theme.mute}33` }}>
                          <div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 8, marginBottom: 8, background: selected ? theme.accent + '22' : theme.mute + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FoodIcon visual={step.visual} style={{ width: 26, height: 26, color: selected ? theme.accent : theme.mute }} />
                          </div>
                          <div style={{ fontSize: fs(12), fontWeight: selected ? 700 : 500, color: theme.text }}>{opt.label}</div>
                          <div style={{ fontSize: fs(10), color: selected ? theme.accent : theme.mute, marginTop: 2 }}>{priceLabel(step, opt.price || 0)}</div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {settings.voiceOn && (
                <div style={{ position: 'absolute', left: 16, right: 16, bottom: isPriceStep ? 158 : 118, background: 'rgba(0,0,0,0.62)', color: '#fff', borderRadius: 12, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, fontSize: fs(12) }}>
                  <Volume2 style={{ width: 15, height: 15, flexShrink: 0 }} />
                  {step.voice_text}
                </div>
              )}

              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
                {isPriceStep && (
                  <div style={{ background: theme.card, borderTop: `1px solid ${theme.mute}33`, padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: fs(11), color: theme.mute }}>주문 금액 · 수량 1</span>
                    <span style={{ fontSize: fs(17), fontWeight: 700, color: theme.text }}>{total.toLocaleString()}원</span>
                  </div>
                )}
                <div style={{ display: 'flex' }}>
                  <button onClick={() => { setStepIndex(0); setSelections({}); }}
                    style={{ flex: 1, height: 58, background: theme.mute + '22', color: theme.text, border: 'none', fontSize: fs(13), fontWeight: 600, cursor: 'pointer' }}>취소</button>
                  <button onClick={() => setStepIndex((i) => Math.max(0, i - 1))} disabled={stepIndex === 0}
                    style={{ flex: 1, height: 58, background: 'transparent', color: theme.text, border: 'none', borderLeft: `1px solid ${theme.mute}33`, fontSize: fs(13), fontWeight: 600, cursor: stepIndex === 0 ? 'not-allowed' : 'pointer', opacity: stepIndex === 0 ? 0.4 : 1 }}>이전</button>
                  <button onClick={goNext} disabled={!canProceed}
                    style={{ flex: 2, height: 58, background: canProceed ? theme.accent : theme.mute, color: '#fff', border: 'none', fontSize: fs(16), fontWeight: 700, cursor: canProceed ? 'pointer' : 'not-allowed' }}>
                    {isLast ? '연습 완료' : (isConfirmStep ? '결제하러 가기' : '다음')}
                  </button>
                </div>
              </div>
            </div>
          )}

          {screen === 'flow' && mode === 'realtime' && step && (
            <div style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <ArrowLeft onClick={goBack} style={{ width: 18, height: 18, color: app.inkSoft, cursor: 'pointer' }} />
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 6, background: app.realtimeSoft, color: app.realtime }}>실시간 안내</span>
                <div style={{ flex: 1, height: 6, background: app.bg, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ width: `${((stepIndex + 1) / steps.length) * 100}%`, height: '100%', background: app.realtime }} />
                </div>
                <span style={{ fontSize: 11, color: app.inkSoft }}>{stepIndex + 1}/{steps.length}</span>
              </div>

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: fs(17), fontWeight: 600, color: app.ink, marginBottom: 4 }}>{step.title}</div>
                {step.type === 'confirm' ? (
                  <div style={{ background: app.bg, borderRadius: 12, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                    {steps.filter((s) => s.options && s.step_id !== step.step_id).flatMap((s) => (selections[s.step_id] || []).map((oid) => {
                      const opt = s.options.find((o) => o.option_id === oid);
                      if (!opt) return null;
                      return (
                        <div key={s.step_id + oid} style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(13) }}>
                          <span style={{ color: app.ink, fontWeight: 500 }}>{opt.label}</span>
                          <span style={{ color: app.inkSoft }}>{priceLabel(s, opt.price || 0)}</span>
                        </div>
                      );
                    }))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: fs(14), fontWeight: 700, borderTop: '1px solid ' + app.border, paddingTop: 8, marginTop: 2 }}>
                      <span style={{ color: app.ink }}>합계</span><span style={{ color: app.ink }}>{total.toLocaleString()}원</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div style={{ fontSize: fs(12), color: app.inkSoft, margin: '4px 0 14px' }}>지금 눈앞의 기계 화면에서 골라주세요</div>
                    <div style={{ display: 'grid', gridTemplateColumns: step.type === 'binary_choice' ? '1fr' : '1fr 1fr', gap: 10 }}>
                      {step.options.map((opt) => {
                        const selected = currentSelection.includes(opt.option_id);
                        return (
                          <div key={opt.option_id} onClick={() => toggleOption(opt.option_id)}
                            style={{ minHeight: 52, borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '8px 4px', fontSize: fs(14), fontWeight: 500, cursor: 'pointer',
                              background: selected ? app.realtimeSoft : app.bg, border: selected ? '2px solid ' + app.realtime : '1px solid ' + app.border,
                              color: selected ? app.realtime : app.ink }}>
                            <span>{opt.label}</span>
                            {(opt.price || 0) > 0 && <span style={{ fontSize: fs(10), opacity: 0.8 }}>{priceLabel(step, opt.price)}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>

              {settings.voiceOn && (
                <div style={{ background: app.bg, borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Volume2 style={{ width: 18, height: 18, color: app.realtime, flexShrink: 0 }} />
                  <div style={{ fontSize: fs(12), color: app.inkSoft }}>{step.voice_text}</div>
                </div>
              )}

              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <Button app={app} variant="ghost" style={{ flex: 1, border: '1px solid ' + app.border }} onClick={() => {}}>
                  <RotateCcw style={{ width: 15, height: 15 }} /> 다시 설명해줘
                </Button>
                <Button app={app} variant="outlineRealtime" style={{ flex: 1 }} onClick={() => setCalledStaff(true)}>
                  <User style={{ width: 15, height: 15 }} /> 직원 호출
                </Button>
              </div>
              {calledStaff && (
                <div style={{ fontSize: fs(12), color: app.realtime, background: app.realtimeSoft, borderRadius: 8, padding: '8px 10px', marginBottom: 10 }}>
                  직원을 호출했어요. 잠시만 기다려주세요.
                </div>
              )}

              <Button app={app} variant="realtime" disabled={!canProceed} onClick={goNext} style={{ width: '100%' }}>
                {isLast ? '완료' : (isConfirmStep ? '결제하러 가기' : '다음')}
              </Button>
            </div>
          )}

          {screen === 'complete' && (
            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', minHeight: 500, justifyContent: 'center' }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: mode === 'practice' ? app.practiceSoft : app.realtimeSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Check style={{ width: 28, height: 28, color: mode === 'practice' ? app.practice : app.realtime }} />
              </div>
              <div style={{ fontSize: fs(18), fontWeight: 600, color: app.ink, marginBottom: 6 }}>
                {mode === 'practice' ? '연습을 완료했어요' : '주문을 완료했어요'}
              </div>
              <div style={{ fontSize: fs(13), color: app.inkSoft, marginBottom: 8, lineHeight: 1.6 }}>
                {summaryLine(brandId, selections)}
              </div>
              <div style={{ fontSize: fs(15), color: app.ink, fontWeight: 700, marginBottom: 20 }}>총 {total.toLocaleString()}원</div>
              {!savedThisRun ? (
                <>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="이 조합 이름 (예: 내가 좋아하는 조합)"
                    style={{ width: '100%', height: 44, borderRadius: 10, border: '1px solid ' + app.border, padding: '0 12px', fontSize: fs(13), marginBottom: 10, boxSizing: 'border-box', color: app.ink, background: app.surface }}
                  />
                  <Button app={app} variant="primary" style={{ width: '100%', marginBottom: 10 }} onClick={saveCurrentOrder}>
                    <Heart style={{ width: 16, height: 16 }} /> 내 주문으로 저장
                  </Button>
                </>
              ) : (
                <div style={{ fontSize: fs(13), color: app.practice, marginBottom: 10 }}>저장했어요</div>
              )}
              <Button app={app} variant="ghost" style={{ width: '100%' }} onClick={() => setScreen('home')}>
                <HomeIcon style={{ width: 16, height: 16 }} /> 홈으로
              </Button>
            </div>
          )}

          {screen === 'orders' && (
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: fs(19), fontWeight: 600, color: app.ink, marginBottom: 16 }}>내 주문</div>
              {savedOrders.length === 0 && (
                <div style={{ fontSize: fs(13), color: app.inkSoft, textAlign: 'center', padding: '40px 0' }}>
                  아직 저장된 주문이 없어요.<br />연습을 완료하면 여기에 저장할 수 있어요.
                </div>
              )}
              {savedOrders.map((o) => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: app.bg, borderRadius: 12, padding: 14, marginBottom: 10, border: settings.highContrast ? '1px solid ' + app.border : 'none' }}>
                  <ClipboardCheck style={{ width: 18, height: 18, color: app.practice, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: fs(14), fontWeight: 600, color: app.ink }}>{o.nickname}</div>
                    <div style={{ fontSize: fs(11), color: app.inkSoft, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.storeName} · {summaryLine(o.brandId, o.selections)}</div>
                  </div>
                  <Trash2 onClick={() => deleteOrder(o.id)} style={{ width: 17, height: 17, color: app.inkSoft, cursor: 'pointer', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          )}

          {screen === 'settings' && (
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: fs(19), fontWeight: 600, color: app.ink, marginBottom: 20 }}>설정</div>
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Type style={{ width: 16, height: 16, color: app.inkSoft }} />
                  <span style={{ fontSize: fs(13), color: app.inkSoft }}>글씨 크기</span>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{ label: '작게', v: 0.9 }, { label: '보통', v: 1 }, { label: '크게', v: 1.2 }].map((opt) => (
                    <div key={opt.label} onClick={() => updateSettings({ fontScale: opt.v })}
                      style={{ flex: 1, textAlign: 'center', padding: '10px 0', borderRadius: 10, cursor: 'pointer', fontSize: fs(13),
                        background: settings.fontScale === opt.v ? app.practiceSoft : app.bg,
                        color: settings.fontScale === opt.v ? app.practice : app.ink,
                        border: settings.fontScale === opt.v ? '1px solid ' + app.practice : '1px solid transparent' }}>
                      {opt.label}
                    </div>
                  ))}
                </div>
              </div>
              <div onClick={() => updateSettings({ voiceOn: !settings.voiceOn })}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: app.bg, borderRadius: 12, padding: 14, marginBottom: 12, cursor: 'pointer' }}>
                {settings.voiceOn ? <Volume2 style={{ width: 18, height: 18, color: app.practice }} /> : <VolumeX style={{ width: 18, height: 18, color: app.inkSoft }} />}
                <span style={{ flex: 1, fontSize: fs(14), color: app.ink }}>음성 안내</span>
                <div style={{ width: 40, height: 24, borderRadius: 12, background: settings.voiceOn ? app.practice : app.border, position: 'relative' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: settings.voiceOn ? 19 : 3 }} />
                </div>
              </div>
              <div onClick={() => updateSettings({ highContrast: !settings.highContrast })}
                style={{ display: 'flex', alignItems: 'center', gap: 10, background: app.bg, borderRadius: 12, padding: 14, cursor: 'pointer' }}>
                <Eye style={{ width: 18, height: 18, color: settings.highContrast ? app.practice : app.inkSoft }} />
                <span style={{ flex: 1, fontSize: fs(14), color: app.ink }}>고대비 모드</span>
                <div style={{ width: 40, height: 24, borderRadius: 12, background: settings.highContrast ? app.practice : app.border, position: 'relative' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: settings.highContrast ? 19 : 3 }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {showTabs && (
          <div style={{ display: 'flex', justifyContent: 'space-around', borderTop: '1px solid ' + app.border, padding: '10px 0' }}>
            {[
              { id: 'home', label: '홈', Icon: HomeIcon },
              { id: 'orders', label: '내 주문', Icon: List },
              { id: 'settings', label: '설정', Icon: SettingsIcon },
            ].map((t) => (
              <div key={t.id} onClick={() => setScreen(t.id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, color: screen === t.id ? app.practice : app.inkSoft, cursor: 'pointer' }}>
                <t.Icon style={{ width: 20, height: 20 }} />
                <span style={{ fontSize: 10 }}>{t.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
