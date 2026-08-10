import { Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowLeft, Volume2 } from 'lucide-react-native';
import { StepTracker } from '../components/StepTracker';
import { phaseIndexForScreen } from '../lib/content';

export function PracticeDiningOptionScreen({ app, settings, fs, theme, brand, onBack, onPickDiningOption }) {
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 8 }}>
        <Pressable onPress={onBack} style={{ marginLeft: 10 }}>
          <ArrowLeft size={18} color={theme.mute} />
        </Pressable>
        <View style={{ flex: 1 }}><StepTracker theme={theme} currentPhase={phaseIndexForScreen('diningOption')} /></View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: fs(19), fontWeight: '600', color: theme.text, marginBottom: 16 }}>{brand.dining_options.title}</Text>
        <View style={{ gap: 10 }}>
          {brand.dining_options.options.map((opt) => (
            <Pressable key={opt.option_id} onPress={() => onPickDiningOption(opt.option_id)} style={{
              backgroundColor: theme.card, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16,
              borderWidth: 1, borderColor: theme.mute + '44',
            }}>
              <Text style={{ fontSize: fs(15), fontWeight: '500', color: theme.text }}>{opt.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
      {settings.voiceOn && (
        <View style={{
          margin: 16, marginTop: 0, backgroundColor: 'rgba(0,0,0,0.62)', borderRadius: 12,
          paddingVertical: 10, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8,
        }}>
          <Volume2 size={15} color="#fff" />
          <Text style={{ color: '#fff', fontSize: fs(12), flex: 1 }}>{brand.dining_options.voice_text}</Text>
        </View>
      )}
    </View>
  );
}

export function RealtimeDiningOptionScreen({ app, settings, fs, brand, onBack, onPickDiningOption }) {
  return (
    <ScrollView style={{ padding: 20 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <Pressable onPress={onBack}>
          <ArrowLeft size={18} color={app.inkSoft} />
        </Pressable>
        <Text style={{ fontSize: 11, fontWeight: '600', paddingVertical: 3, paddingHorizontal: 9, borderRadius: 6, backgroundColor: app.realtimeSoft, color: app.realtime }}>실시간 안내</Text>
      </View>
      <Text style={{ fontSize: fs(17), fontWeight: '600', color: app.ink, marginBottom: 16 }}>{brand.dining_options.title}</Text>
      <View style={{ gap: 10, marginBottom: 14 }}>
        {brand.dining_options.options.map((opt) => (
          <Pressable key={opt.option_id} onPress={() => onPickDiningOption(opt.option_id)} style={{
            minHeight: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingVertical: 8, paddingHorizontal: 4,
            backgroundColor: app.bg, borderWidth: 1, borderColor: app.border,
          }}>
            <Text style={{ fontSize: fs(14), fontWeight: '500', color: app.ink }}>{opt.label}</Text>
          </Pressable>
        ))}
      </View>
      {settings.voiceOn && (
        <View style={{ backgroundColor: app.bg, borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Volume2 size={18} color={app.realtime} />
          <Text style={{ fontSize: fs(12), color: app.inkSoft, flex: 1 }}>{brand.dining_options.voice_text}</Text>
        </View>
      )}
    </ScrollView>
  );
}
