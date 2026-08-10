import { Pressable, ScrollView, Text, View } from 'react-native';
import { Eye, Type, Volume2, VolumeX } from 'lucide-react-native';

const FONT_OPTIONS = [{ label: '작게', v: 0.9 }, { label: '보통', v: 1 }, { label: '크게', v: 1.2 }];

export function SettingsScreen({ app, settings, fs, onUpdateSettings }) {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: fs(19), fontWeight: '600', color: app.ink, marginBottom: 20 }}>설정</Text>
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Type size={16} color={app.inkSoft} />
          <Text style={{ fontSize: fs(13), color: app.inkSoft }}>글씨 크기</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {FONT_OPTIONS.map((opt) => {
            const active = settings.fontScale === opt.v;
            return (
              <Pressable key={opt.label} onPress={() => onUpdateSettings({ fontScale: opt.v })} style={{
                flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 10,
                backgroundColor: active ? app.practiceSoft : app.bg,
                borderWidth: 1, borderColor: active ? app.practice : 'transparent',
              }}>
                <Text style={{ fontSize: fs(13), color: active ? app.practice : app.ink }}>{opt.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Pressable onPress={() => onUpdateSettings({ voiceOn: !settings.voiceOn })} style={{
        flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: app.bg, borderRadius: 12, padding: 14, marginBottom: 12,
      }}>
        {settings.voiceOn ? <Volume2 size={18} color={app.practice} /> : <VolumeX size={18} color={app.inkSoft} />}
        <Text style={{ flex: 1, fontSize: fs(14), color: app.ink }}>음성 안내</Text>
        <View style={{ width: 40, height: 24, borderRadius: 12, backgroundColor: settings.voiceOn ? app.practice : app.border }}>
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', position: 'absolute', top: 3, left: settings.voiceOn ? 19 : 3 }} />
        </View>
      </Pressable>
      <Pressable onPress={() => onUpdateSettings({ highContrast: !settings.highContrast })} style={{
        flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: app.bg, borderRadius: 12, padding: 14,
      }}>
        <Eye size={18} color={settings.highContrast ? app.practice : app.inkSoft} />
        <Text style={{ flex: 1, fontSize: fs(14), color: app.ink }}>고대비 모드</Text>
        <View style={{ width: 40, height: 24, borderRadius: 12, backgroundColor: settings.highContrast ? app.practice : app.border }}>
          <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', position: 'absolute', top: 3, left: settings.highContrast ? 19 : 3 }} />
        </View>
      </Pressable>
    </ScrollView>
  );
}
