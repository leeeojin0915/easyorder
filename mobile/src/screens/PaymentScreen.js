import { Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowLeft, RotateCcw, User, Volume2 } from 'lucide-react-native';
import { StepTracker } from '../components/StepTracker';
import { PaymentIcon } from '../components/PaymentIcon';
import { Button } from '../components/Button';
import { phaseIndexForScreen } from '../lib/content';

export function PracticePaymentScreen({ app, settings, fs, theme, device, paymentStep, total, onBack, onComplete }) {
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 8 }}>
        <Pressable onPress={onBack} style={{ marginLeft: 10 }}>
          <ArrowLeft size={18} color={theme.mute} />
        </Pressable>
        <View style={{ flex: 1 }}><StepTracker theme={theme} currentPhase={phaseIndexForScreen('payment')} /></View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={{ fontSize: fs(19), fontWeight: '600', color: theme.text, marginBottom: 16 }}>{paymentStep.title}</Text>
        <Text style={{ fontSize: fs(13), color: theme.mute, marginBottom: 14 }}>
          결제 금액 <Text style={{ color: theme.text, fontWeight: '700' }}>{total.toLocaleString()}원</Text>
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {paymentStep.options.map((opt) => {
            const itemWidth = device.orientation === 'landscape' ? '48%' : '100%';
            return (
              <Pressable key={opt.option_id} onPress={onComplete} style={{
                width: itemWidth, backgroundColor: theme.card, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16,
                flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: theme.mute + '44',
              }}>
                <PaymentIcon icon={opt.icon} size={20} color={theme.text} />
                <Text style={{ fontSize: fs(15), fontWeight: '500', color: theme.text }}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={{ marginTop: 12, fontSize: fs(11), color: theme.mute }}>연습 모드입니다. 실제 결제는 진행되지 않아요.</Text>
      </ScrollView>
      {settings.voiceOn && (
        <View style={{ position: 'absolute', left: 16, right: 16, bottom: 16, backgroundColor: 'rgba(0,0,0,0.62)', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Volume2 size={15} color="#fff" />
          <Text style={{ color: '#fff', fontSize: fs(12), flex: 1 }}>{paymentStep.voice_text}</Text>
        </View>
      )}
    </View>
  );
}

export function RealtimePaymentScreen({ app, settings, fs, paymentStep, total, calledStaff, onBack, onCallStaff, onComplete }) {
  return (
    <ScrollView style={{ padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Pressable onPress={onBack}>
          <ArrowLeft size={18} color={app.inkSoft} />
        </Pressable>
        <Text style={{ fontSize: 11, fontWeight: '600', paddingVertical: 3, paddingHorizontal: 9, borderRadius: 6, backgroundColor: app.realtimeSoft, color: app.realtime }}>실시간 안내</Text>
      </View>
      <Text style={{ fontSize: fs(17), fontWeight: '600', color: app.ink, marginBottom: 4 }}>{paymentStep.title}</Text>
      <Text style={{ fontSize: fs(12), color: app.inkSoft, marginVertical: 10 }}>지금 눈앞의 기계에서 결제를 진행해주세요. 합계 {total.toLocaleString()}원</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
        {paymentStep.options.map((opt) => (
          <View key={opt.option_id} style={{ width: '48%', minHeight: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: app.bg, borderWidth: 1, borderColor: app.border }}>
            <PaymentIcon icon={opt.icon} size={18} color={app.ink} />
            <Text style={{ fontSize: fs(13), color: app.ink }}>{opt.label}</Text>
          </View>
        ))}
      </View>
      {settings.voiceOn && (
        <View style={{ backgroundColor: app.bg, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <Volume2 size={18} color={app.realtime} />
          <Text style={{ fontSize: fs(12), color: app.inkSoft, flex: 1 }}>{paymentStep.voice_text}</Text>
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
      <Button app={app} variant="realtime" onPress={onComplete} style={{ width: '100%' }}>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>완료</Text>
      </Button>
    </ScrollView>
  );
}
