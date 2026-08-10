import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { SafeAreaView, View } from 'react-native';

import { storage } from './src/lib/storage';
import {
  CONTENT, addCartLine, cartSummaryLine, computeCartTotal, computeItemUnitPrice,
  getItem, isStepAtSelectionCap, removeCartLine, visibleCustomizeSteps,
} from './src/lib/content';
import { APP, APP_HC } from './src/lib/theme';

import { HomeScreen } from './src/screens/HomeScreen';
import { StorePickerScreen } from './src/screens/StorePickerScreen';
import { PracticeDiningOptionScreen, RealtimeDiningOptionScreen } from './src/screens/DiningOptionScreen';
import { PracticeCategoryScreen, RealtimeCategoryScreen } from './src/screens/CategoryScreen';
import { PracticeItemCustomizeScreen, RealtimeItemCustomizeScreen } from './src/screens/ItemCustomizeScreen';
import { PracticeCartReviewScreen, RealtimeCartReviewScreen } from './src/screens/CartReviewScreen';
import { PracticePaymentScreen, RealtimePaymentScreen } from './src/screens/PaymentScreen';
import { CompleteScreen } from './src/screens/CompleteScreen';
import { OrdersScreen } from './src/screens/OrdersScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BottomTabs } from './src/components/BottomTabs';

const STORAGE_SETTINGS_KEY = 'easyorder:settings';
const STORAGE_ORDERS_KEY = 'easyorder:saved_orders';

export default function App() {
  const [ready, setReady] = useState(false);
  const [screen, setScreen] = useState('home');
  const [brandId, setBrandId] = useState('subway');
  const [mode, setMode] = useState('practice');
  const [diningOption, setDiningOption] = useState(null);
  const [cart, setCart] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [activeItemId, setActiveItemId] = useState(null);
  const [itemDraftSelections, setItemDraftSelections] = useState({});
  const [customizeStepIndex, setCustomizeStepIndex] = useState(0);
  const [calledStaff, setCalledStaff] = useState(false);
  const [nickname, setNickname] = useState('');
  const [savedThisRun, setSavedThisRun] = useState(false);
  const [savedOrders, setSavedOrders] = useState([]);
  const [settings, setSettings] = useState({ fontScale: 1, voiceOn: true, highContrast: false });

  useEffect(() => {
    (async () => {
      try {
        const s = await storage.get(STORAGE_SETTINGS_KEY);
        if (s?.value) setSettings(JSON.parse(s.value));
      } catch (e) {}
      try {
        const o = await storage.get(STORAGE_ORDERS_KEY);
        if (o?.value) setSavedOrders(JSON.parse(o.value));
      } catch (e) {}
      setReady(true);
    })();
  }, []);

  async function updateSettings(patch) {
    const next = { ...settings, ...patch };
    setSettings(next);
    try { await storage.set(STORAGE_SETTINGS_KEY, JSON.stringify(next)); } catch (e) {}
  }
  async function persistOrders(next) {
    setSavedOrders(next);
    try { await storage.set(STORAGE_ORDERS_KEY, JSON.stringify(next)); } catch (e) {}
  }
  async function saveCurrentOrder() {
    const brand = CONTENT[brandId];
    const entry = {
      id: `${brandId}_${Date.now()}`, brandId, storeName: brand.store.name,
      nickname: nickname.trim() || `${brand.store.name} 조합`, cart, createdAt: new Date().toISOString(),
    };
    await persistOrders([entry, ...savedOrders]);
    setSavedThisRun(true);
  }
  async function deleteOrder(id) { await persistOrders(savedOrders.filter((o) => o.id !== id)); }

  const app = settings.highContrast ? APP_HC : APP;
  const fs = (px) => Math.round(px * settings.fontScale);
  const brand = CONTENT[brandId];
  const device = brand.device;
  const theme = device.theme;
  const total = computeCartTotal(cart);

  const activeItem = activeCategoryId && activeItemId ? getItem(brandId, activeCategoryId, activeItemId) : null;
  const customizeSteps = activeItem ? visibleCustomizeSteps(activeItem, itemDraftSelections) : [];
  const customizeStep = customizeSteps[customizeStepIndex];
  const currentCustomizeSelection = customizeStep ? (itemDraftSelections[customizeStep.step_id] || []) : [];
  const isLastCustomizeStep = customizeStepIndex === customizeSteps.length - 1;
  const canProceedCustomize = currentCustomizeSelection.length > 0;
  const itemUnitPricePreview = activeItem ? computeItemUnitPrice(activeItem, itemDraftSelections) : 0;

  const paymentStep = brand.order_steps.find((s) => s.type === 'payment_mock');
  const confirmStep = brand.order_steps.find((s) => s.type === 'confirm');

  useEffect(() => {
    if (customizeSteps.length > 0 && customizeStepIndex > customizeSteps.length - 1) {
      setCustomizeStepIndex(customizeSteps.length - 1);
    }
  }, [customizeSteps.length, customizeStepIndex]);

  function toggleCustomizeOption(optId) {
    setItemDraftSelections((prev) => {
      const cur = prev[customizeStep.step_id] || [];
      if (customizeStep.type === 'multi_select') {
        if (cur.includes(optId)) return { ...prev, [customizeStep.step_id]: cur.filter((o) => o !== optId) };
        if (isStepAtSelectionCap(customizeStep, cur)) return prev;
        return { ...prev, [customizeStep.step_id]: [...cur, optId] };
      }
      return { ...prev, [customizeStep.step_id]: [optId] };
    });
  }

  function pickMode(m) {
    setMode(m); setCart([]); setDiningOption(null); setCalledStaff(false); setSavedThisRun(false); setNickname('');
    setScreen('storePicker');
  }
  function pickStore(id) { setBrandId(id); setScreen('diningOption'); }
  function pickDiningOption(optionId) { setDiningOption(optionId); setScreen('category'); }

  function addItemToCart(categoryId, itemId, customizeSelections) {
    setCart((prev) => addCartLine(prev, brandId, { categoryId, itemId, customizeSelections }));
  }
  function openItem(categoryId, itemId) {
    const item = getItem(brandId, categoryId, itemId);
    if (!item.customize_steps || item.customize_steps.length === 0) {
      addItemToCart(categoryId, itemId, {});
      return;
    }
    setActiveCategoryId(categoryId); setActiveItemId(itemId);
    setItemDraftSelections({}); setCustomizeStepIndex(0);
    setScreen('itemCustomize');
  }
  function goNextCustomizeStep() {
    if (isLastCustomizeStep) {
      addItemToCart(activeCategoryId, activeItemId, itemDraftSelections);
      setActiveCategoryId(null); setActiveItemId(null); setItemDraftSelections({}); setCustomizeStepIndex(0);
      setScreen('category');
    } else {
      setCustomizeStepIndex((i) => i + 1);
    }
  }
  function exitItemCustomize() {
    setActiveCategoryId(null); setActiveItemId(null); setItemDraftSelections({}); setCustomizeStepIndex(0);
    setScreen('category');
  }
  function removeFromCart(cartItemId) { setCart((prev) => removeCartLine(prev, cartItemId)); }
  function goToCartReview() { setScreen('cartReview'); }
  function goToPayment() { setScreen('payment'); }
  function completeOrder() { setScreen('complete'); }

  function goBack() {
    if (screen === 'storePicker') { setScreen('home'); return; }
    if (screen === 'diningOption') { setScreen('storePicker'); return; }
    if (screen === 'category') { setScreen('diningOption'); return; }
    if (screen === 'itemCustomize') {
      if (customizeStepIndex === 0) { exitItemCustomize(); } else { setCustomizeStepIndex((i) => i - 1); }
      return;
    }
    if (screen === 'cartReview') { setScreen('category'); return; }
    if (screen === 'payment') { setScreen('cartReview'); return; }
  }

  const isImmersive = mode === 'practice' && ['diningOption', 'category', 'itemCustomize', 'cartReview', 'payment'].includes(screen);
  const showTabs = ['home', 'orders', 'settings'].includes(screen);

  if (!ready) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: app.bg }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: isImmersive ? theme.bg : app.bg }}>
      <View style={{ flex: 1 }}>
        {screen === 'home' && (
          <HomeScreen app={app} fs={fs} savedOrders={savedOrders} onPickMode={pickMode} onOpenOrders={() => setScreen('orders')} />
        )}

        {screen === 'storePicker' && (
          <StorePickerScreen app={app} settings={settings} fs={fs} onBack={goBack} onPickStore={pickStore} />
        )}

        {screen === 'diningOption' && mode === 'practice' && (
          <PracticeDiningOptionScreen
            app={app} settings={settings} fs={fs} theme={theme} brand={brand}
            onBack={goBack} onPickDiningOption={pickDiningOption}
          />
        )}
        {screen === 'diningOption' && mode === 'realtime' && (
          <RealtimeDiningOptionScreen
            app={app} settings={settings} fs={fs} brand={brand}
            onBack={goBack} onPickDiningOption={pickDiningOption}
          />
        )}

        {screen === 'category' && mode === 'practice' && (
          <PracticeCategoryScreen
            app={app} fs={fs} brand={brand} brandId={brandId} theme={theme} device={device} cart={cart}
            onBack={goBack} onOpenItem={openItem} onGoToCartReview={goToCartReview}
          />
        )}
        {screen === 'category' && mode === 'realtime' && (
          <RealtimeCategoryScreen
            app={app} fs={fs} brand={brand} brandId={brandId} theme={theme} cart={cart}
            onBack={goBack} onOpenItem={openItem} onGoToCartReview={goToCartReview}
          />
        )}

        {screen === 'itemCustomize' && mode === 'practice' && activeItem && customizeStep && (
          <PracticeItemCustomizeScreen
            app={app} settings={settings} fs={fs} theme={theme} device={device}
            activeItem={activeItem} customizeStep={customizeStep} currentSelection={currentCustomizeSelection}
            isLastCustomizeStep={isLastCustomizeStep} canProceed={canProceedCustomize}
            customizeStepIndex={customizeStepIndex} itemUnitPricePreview={itemUnitPricePreview}
            onToggleOption={toggleCustomizeOption} onExit={exitItemCustomize}
            onCancel={() => { setCustomizeStepIndex(0); setItemDraftSelections({}); }}
            onPrev={() => setCustomizeStepIndex((i) => Math.max(0, i - 1))}
            onNext={goNextCustomizeStep}
          />
        )}
        {screen === 'itemCustomize' && mode === 'realtime' && activeItem && customizeStep && (
          <RealtimeItemCustomizeScreen
            app={app} settings={settings} fs={fs}
            activeItem={activeItem} customizeStep={customizeStep} currentSelection={currentCustomizeSelection}
            customizeStepsLength={customizeSteps.length} isLastCustomizeStep={isLastCustomizeStep}
            canProceed={canProceedCustomize} customizeStepIndex={customizeStepIndex} calledStaff={calledStaff}
            onToggleOption={toggleCustomizeOption} onBack={goBack} onCallStaff={() => setCalledStaff(true)}
            onNext={goNextCustomizeStep}
          />
        )}

        {screen === 'cartReview' && mode === 'practice' && (
          <PracticeCartReviewScreen
            app={app} settings={settings} fs={fs} theme={theme} cart={cart} total={total} confirmStep={confirmStep}
            onBack={goBack} onRemove={removeFromCart} onGoToMore={() => setScreen('category')} onGoToPayment={goToPayment}
          />
        )}
        {screen === 'cartReview' && mode === 'realtime' && (
          <RealtimeCartReviewScreen
            app={app} fs={fs} cart={cart} total={total} confirmStep={confirmStep}
            onBack={goBack} onRemove={removeFromCart} onGoToMore={() => setScreen('category')} onGoToPayment={goToPayment}
          />
        )}

        {screen === 'payment' && mode === 'practice' && paymentStep && (
          <PracticePaymentScreen
            app={app} settings={settings} fs={fs} theme={theme} device={device}
            paymentStep={paymentStep} total={total} onBack={goBack} onComplete={completeOrder}
          />
        )}
        {screen === 'payment' && mode === 'realtime' && paymentStep && (
          <RealtimePaymentScreen
            app={app} settings={settings} fs={fs} paymentStep={paymentStep} total={total} calledStaff={calledStaff}
            onBack={goBack} onCallStaff={() => setCalledStaff(true)} onComplete={completeOrder}
          />
        )}

        {screen === 'complete' && (
          <CompleteScreen
            app={app} fs={fs} mode={mode} summary={cartSummaryLine(cart)} total={total}
            nickname={nickname} savedThisRun={savedThisRun}
            onChangeNickname={setNickname} onSave={saveCurrentOrder} onGoHome={() => setScreen('home')}
          />
        )}

        {screen === 'orders' && (
          <OrdersScreen app={app} settings={settings} fs={fs} savedOrders={savedOrders} onDelete={deleteOrder} />
        )}

        {screen === 'settings' && (
          <SettingsScreen app={app} settings={settings} fs={fs} onUpdateSettings={updateSettings} />
        )}
      </View>

      {showTabs && <BottomTabs app={app} screen={screen} onSelect={setScreen} />}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}
