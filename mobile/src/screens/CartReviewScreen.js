import { Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowLeft, Trash2, Volume2 } from 'lucide-react-native';
import { StepTracker } from '../components/StepTracker';
import { phaseIndexForScreen } from '../lib/content';

export function PracticeCartReviewScreen({ app, settings, fs, theme, cart, total, confirmStep, onBack, onRemove, onGoToMore, onGoToPayment }) {
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 8 }}>
        <Pressable onPress={onBack} style={{ marginLeft: 10 }}>
          <ArrowLeft size={18} color={theme.mute} />
        </Pressable>
        <View style={{ flex: 1 }}><StepTracker theme={theme} currentPhase={phaseIndexForScreen('cartReview')} /></View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 190 }}>
        <Text style={{ fontSize: fs(19), fontWeight: '600', color: theme.text, marginBottom: 16 }}>{confirmStep.title}</Text>
        {cart.length === 0 ? (
          <Text style={{ fontSize: fs(13), color: theme.mute, textAlign: 'center', paddingVertical: 40 }}>담긴 메뉴가 없어요.</Text>
        ) : (
          <View style={{ backgroundColor: theme.card, borderRadius: 14, padding: 16, gap: 14 }}>
            {cart.map((line) => (
              <View key={line.cartItemId} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: fs(14), fontWeight: '600', color: theme.text }}>{line.label}{line.qty > 1 ? ` x${line.qty}` : ''}</Text>
                  {line.optionLabels.length > 0 && <Text style={{ fontSize: fs(12), color: theme.mute }}>{line.optionLabels.join(', ')}</Text>}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ fontSize: fs(13), color: theme.text }}>{line.lineTotal.toLocaleString()}원</Text>
                  <Pressable onPress={() => onRemove(line.cartItemId)}>
                    <Trash2 size={16} color={theme.mute} />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      {settings.voiceOn && (
        <View style={{ position: 'absolute', left: 16, right: 16, bottom: 158, backgroundColor: 'rgba(0,0,0,0.62)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Volume2 size={15} color="#fff" />
          <Text style={{ color: '#fff', fontSize: fs(12), flex: 1 }}>{confirmStep.voice_text}</Text>
        </View>
      )}
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <View style={{ backgroundColor: theme.card, borderTopWidth: 1, borderTopColor: theme.mute + '33', paddingVertical: 10, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: fs(11), color: theme.mute }}>주문 금액</Text>
          <Text style={{ fontSize: fs(17), fontWeight: '700', color: theme.text }}>{total.toLocaleString()}원</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Pressable onPress={onGoToMore} style={{ flex: 1, height: 58, backgroundColor: theme.mute + '22', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: theme.text, fontSize: fs(13), fontWeight: '600' }}>메뉴 더 담기</Text>
          </Pressable>
          <Pressable onPress={onGoToPayment} disabled={cart.length === 0} style={{ flex: 2, height: 58, backgroundColor: cart.length === 0 ? theme.mute : theme.accent, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: fs(16), fontWeight: '700' }}>결제하러 가기</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function RealtimeCartReviewScreen({ app, fs, cart, total, confirmStep, onBack, onRemove, onGoToMore, onGoToPayment }) {
  return (
    <View style={{ padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Pressable onPress={onBack}>
          <ArrowLeft size={18} color={app.inkSoft} />
        </Pressable>
        <Text style={{ fontSize: 11, fontWeight: '600', paddingVertical: 3, paddingHorizontal: 9, borderRadius: 6, backgroundColor: app.realtimeSoft, color: app.realtime }}>실시간 안내</Text>
      </View>
      <Text style={{ fontSize: fs(17), fontWeight: '600', color: app.ink, marginBottom: 12 }}>{confirmStep.title}</Text>
      {cart.length === 0 ? (
        <Text style={{ fontSize: fs(13), color: app.inkSoft, textAlign: 'center', paddingVertical: 30 }}>담긴 메뉴가 없어요.</Text>
      ) : (
        <View style={{ backgroundColor: app.bg, borderRadius: 12, padding: 14, gap: 10, marginBottom: 14 }}>
          {cart.map((line) => (
            <View key={line.cartItemId} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View>
                <Text style={{ fontSize: fs(13), fontWeight: '500', color: app.ink }}>{line.label}{line.qty > 1 ? ` x${line.qty}` : ''}</Text>
                {line.optionLabels.length > 0 && <Text style={{ fontSize: fs(11), color: app.inkSoft }}>{line.optionLabels.join(', ')}</Text>}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text style={{ fontSize: fs(13), color: app.inkSoft }}>{line.lineTotal.toLocaleString()}원</Text>
                <Pressable onPress={() => onRemove(line.cartItemId)}>
                  <Trash2 size={15} color={app.inkSoft} />
                </Pressable>
              </View>
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: app.border, paddingTop: 8, marginTop: 2 }}>
            <Text style={{ fontSize: fs(14), fontWeight: '700', color: app.ink }}>합계</Text>
            <Text style={{ fontSize: fs(14), fontWeight: '700', color: app.ink }}>{total.toLocaleString()}원</Text>
          </View>
        </View>
      )}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable onPress={onGoToMore} style={{ flex: 1, height: 48, borderRadius: 12, borderWidth: 1, borderColor: app.border, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: app.inkSoft, fontSize: 15 }}>메뉴 더 담기</Text>
        </Pressable>
        <Pressable onPress={onGoToPayment} disabled={cart.length === 0} style={{ flex: 2, height: 48, borderRadius: 12, backgroundColor: app.realtime, alignItems: 'center', justifyContent: 'center', opacity: cart.length === 0 ? 0.5 : 1 }}>
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>결제하러 가기</Text>
        </Pressable>
      </View>
    </View>
  );
}
