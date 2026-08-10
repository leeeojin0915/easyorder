import { Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowLeft, RotateCcw, User, Volume2 } from 'lucide-react-native';
import { StepTracker } from '../components/StepTracker';
import { FoodIcon } from '../components/FoodIcon';
import { Button } from '../components/Button';
import { isStepAtSelectionCap, phaseIndexForScreen, priceLabel } from '../lib/content';

export function PracticeItemCustomizeScreen({
  app, settings, fs, theme, device, activeItem, customizeStep, currentSelection,
  isLastCustomizeStep, canProceed, customizeStepIndex, itemUnitPricePreview,
  onToggleOption, onExit, onCancel, onPrev, onNext,
}) {
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 8 }}>
        <Pressable onPress={onExit} style={{ marginLeft: 10 }}>
          <ArrowLeft size={18} color={theme.mute} />
        </Pressable>
        <View style={{ flex: 1 }}><StepTracker theme={theme} currentPhase={phaseIndexForScreen('itemCustomize')} /></View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 190 }}>
        <Text style={{ fontSize: fs(13), color: theme.mute, marginBottom: 4 }}>{activeItem.label}</Text>
        <Text style={{ fontSize: fs(19), fontWeight: '600', color: theme.text, marginBottom: 4 }}>{customizeStep.title}</Text>
        {customizeStep.max_selections !== undefined && (
          <Text style={{ fontSize: fs(12), color: theme.mute, marginBottom: 12 }}>{currentSelection.length}/{customizeStep.max_selections} 선택</Text>
        )}

        {customizeStep.type === 'binary_choice' ? (
          <View style={{ gap: 10 }}>
            {customizeStep.options.map((opt) => {
              const selected = currentSelection.includes(opt.option_id);
              return (
                <Pressable key={opt.option_id} onPress={() => onToggleOption(opt.option_id)} style={{
                  backgroundColor: selected ? theme.accent : theme.card, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16,
                  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  borderWidth: selected ? 0 : 1, borderColor: theme.mute + '44',
                }}>
                  <Text style={{ fontSize: fs(15), fontWeight: selected ? '600' : '500', color: selected ? '#fff' : theme.text }}>{opt.label}</Text>
                  {opt.price > 0 && <Text style={{ fontSize: fs(12), color: selected ? '#fff' : theme.mute }}>{priceLabel(customizeStep, opt.price)}</Text>}
                </Pressable>
              );
            })}
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {customizeStep.options.map((opt) => {
              const selected = currentSelection.includes(opt.option_id);
              const disabledByCap = !selected && isStepAtSelectionCap(customizeStep, currentSelection);
              const gridColumns = device.orientation === 'landscape' ? 3 : (customizeStep.options.length > 3 ? 2 : 3);
              const itemWidth = gridColumns === 3 ? '31%' : '48%';
              return (
                <Pressable key={opt.option_id} onPress={() => !disabledByCap && onToggleOption(opt.option_id)} disabled={disabledByCap} style={{
                  width: itemWidth, backgroundColor: theme.card, borderRadius: 12, padding: 10, alignItems: 'center', opacity: disabledByCap ? 0.4 : 1,
                  borderWidth: selected ? 2 : 1, borderColor: selected ? theme.accent : theme.mute + '33',
                }}>
                  <View style={{
                    width: '100%', aspectRatio: 1, borderRadius: 8, marginBottom: 8,
                    backgroundColor: selected ? theme.accent + '22' : theme.mute + '18',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    <FoodIcon visual={customizeStep.visual} size={26} color={selected ? theme.accent : theme.mute} />
                  </View>
                  <Text style={{ fontSize: fs(12), fontWeight: selected ? '700' : '500', color: theme.text, textAlign: 'center' }}>{opt.label}</Text>
                  <Text style={{ fontSize: fs(10), color: selected ? theme.accent : theme.mute, marginTop: 2 }}>{priceLabel(customizeStep, opt.price || 0)}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>

      {settings.voiceOn && (
        <View style={{
          position: 'absolute', left: 16, right: 16, bottom: 118,
          backgroundColor: 'rgba(0,0,0,0.62)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12,
          flexDirection: 'row', alignItems: 'center', gap: 8,
        }}>
          <Volume2 size={15} color="#fff" />
          <Text style={{ color: '#fff', fontSize: fs(12), flex: 1 }}>{customizeStep.voice_text}</Text>
        </View>
      )}

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <View style={{
          backgroundColor: theme.card, borderTopWidth: 1, borderTopColor: theme.mute + '33',
          paddingVertical: 10, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <Text style={{ fontSize: fs(11), color: theme.mute }}>이 메뉴 가격</Text>
          <Text style={{ fontSize: fs(17), fontWeight: '700', color: theme.text }}>{itemUnitPricePreview.toLocaleString()}원</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Pressable onPress={onCancel} style={{ flex: 1, height: 58, backgroundColor: theme.mute + '22', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: theme.text, fontSize: fs(13), fontWeight: '600' }}>취소</Text>
          </Pressable>
          <Pressable onPress={onPrev} disabled={customizeStepIndex === 0} style={{
            flex: 1, height: 58, alignItems: 'center', justifyContent: 'center',
            borderLeftWidth: 1, borderLeftColor: theme.mute + '33', opacity: customizeStepIndex === 0 ? 0.4 : 1,
          }}>
            <Text style={{ color: theme.text, fontSize: fs(13), fontWeight: '600' }}>이전</Text>
          </Pressable>
          <Pressable onPress={onNext} disabled={!canProceed} style={{
            flex: 2, height: 58, backgroundColor: canProceed ? theme.accent : theme.mute, alignItems: 'center', justifyContent: 'center',
          }}>
            <Text style={{ color: '#fff', fontSize: fs(16), fontWeight: '700' }}>
              {isLastCustomizeStep ? '장바구니에 담기' : '다음'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function RealtimeItemCustomizeScreen({
  app, settings, fs, activeItem, customizeStep, currentSelection, customizeStepsLength,
  isLastCustomizeStep, canProceed, customizeStepIndex, calledStaff,
  onToggleOption, onBack, onCallStaff, onNext,
}) {
  return (
    <ScrollView style={{ padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Pressable onPress={onBack}>
          <ArrowLeft size={18} color={app.inkSoft} />
        </Pressable>
        <Text style={{ fontSize: 11, fontWeight: '600', paddingVertical: 3, paddingHorizontal: 9, borderRadius: 6, backgroundColor: app.realtimeSoft, color: app.realtime }}>실시간 안내</Text>
        <View style={{ flex: 1, height: 6, backgroundColor: app.bg, borderRadius: 3, overflow: 'hidden' }}>
          <View style={{ width: `${((customizeStepIndex + 1) / customizeStepsLength) * 100}%`, height: '100%', backgroundColor: app.realtime }} />
        </View>
        <Text style={{ fontSize: 11, color: app.inkSoft }}>{customizeStepIndex + 1}/{customizeStepsLength}</Text>
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: fs(13), color: app.inkSoft, marginBottom: 2 }}>{activeItem.label}</Text>
        <Text style={{ fontSize: fs(17), fontWeight: '600', color: app.ink, marginBottom: 4 }}>{customizeStep.title}</Text>
        <Text style={{ fontSize: fs(12), color: app.inkSoft, marginTop: 4, marginBottom: customizeStep.max_selections !== undefined ? 2 : 10 }}>지금 눈앞의 기계 화면에서 골라주세요</Text>
        {customizeStep.max_selections !== undefined && (
          <Text style={{ fontSize: fs(12), color: app.inkSoft, marginBottom: 10 }}>{currentSelection.length}/{customizeStep.max_selections} 선택</Text>
        )}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {customizeStep.options.map((opt) => {
            const selected = currentSelection.includes(opt.option_id);
            const disabledByCap = !selected && isStepAtSelectionCap(customizeStep, currentSelection);
            const itemWidth = customizeStep.type === 'binary_choice' ? '100%' : '48%';
            return (
              <Pressable key={opt.option_id} onPress={() => !disabledByCap && onToggleOption(opt.option_id)} disabled={disabledByCap} style={{
                width: itemWidth, minHeight: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
                paddingVertical: 8, paddingHorizontal: 4, opacity: disabledByCap ? 0.4 : 1,
                backgroundColor: selected ? app.realtimeSoft : app.bg,
                borderWidth: selected ? 2 : 1, borderColor: selected ? app.realtime : app.border,
              }}>
                <Text style={{ fontSize: fs(14), fontWeight: '500', color: selected ? app.realtime : app.ink }}>{opt.label}</Text>
                {(opt.price || 0) > 0 && <Text style={{ fontSize: fs(10), color: selected ? app.realtime : app.ink, opacity: 0.8 }}>{priceLabel(customizeStep, opt.price)}</Text>}
              </Pressable>
            );
          })}
        </View>
      </View>

      {settings.voiceOn && (
        <View style={{ backgroundColor: app.bg, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Volume2 size={18} color={app.realtime} />
          <Text style={{ fontSize: fs(12), color: app.inkSoft, flex: 1 }}>{customizeStep.voice_text}</Text>
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
        <Button app={app} variant="ghost" style={{ flex: 1, borderWidth: 1, borderColor: app.border }} onPress={() => {}}>
          <RotateCcw size={15} color={app.inkSoft} />
          <Text style={{ color: app.inkSoft, fontSize: 15, fontWeight: '500' }}>다시 설명해줘</Text>
        </Button>
        <Button app={app} variant="outlineRealtime" style={{ flex: 1 }} onPress={onCallStaff}>
          <User size={15} color={app.realtime} />
          <Text style={{ color: app.realtime, fontSize: 15, fontWeight: '500' }}>직원 호출</Text>
        </Button>
      </View>
      {calledStaff && (
        <Text style={{ fontSize: fs(12), color: app.realtime, backgroundColor: app.realtimeSoft, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, marginBottom: 10 }}>
          직원을 호출했어요. 잠시만 기다려주세요.
        </Text>
      )}

      <Button app={app} variant="realtime" disabled={!canProceed} onPress={onNext} style={{ width: '100%' }}>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
          {isLastCustomizeStep ? '장바구니에 담기' : '다음'}
        </Text>
      </Button>
    </ScrollView>
  );
}
