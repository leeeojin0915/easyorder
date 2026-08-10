import { Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowLeft, ChevronRight, Search } from 'lucide-react-native';
import { CONTENT } from '../lib/content';

export function StorePickerScreen({ app, settings, fs, onBack, onPickStore }) {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Pressable onPress={onBack} style={{ marginBottom: 20 }}>
        <ArrowLeft size={20} color={app.inkSoft} />
      </Pressable>
      <Text style={{ fontSize: fs(20), fontWeight: '600', color: app.ink, marginBottom: 16 }}>매장을 선택하세요</Text>
      <View style={{
        flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: app.bg, borderRadius: 12,
        paddingVertical: 12, paddingHorizontal: 14, marginBottom: 20,
      }}>
        <Search size={18} color={app.inkSoft} />
        <Text style={{ fontSize: fs(14), color: app.inkSoft }}>매장 이름으로 검색</Text>
      </View>
      <Text style={{ fontSize: fs(13), color: app.inkSoft, marginBottom: 8 }}>가까운 매장</Text>
      {Object.entries(CONTENT).map(([id, b]) => {
        const Icon = b.store.icon;
        return (
          <Pressable key={id} onPress={() => onPickStore(id)} style={{
            flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: app.bg, borderRadius: 16,
            padding: 16, marginBottom: 12,
          }}>
            <View style={{ width: 46, height: 46, borderRadius: 12, backgroundColor: b.store.iconBg, alignItems: 'center', justifyContent: 'center' }}>
              <Icon size={24} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: fs(16), fontWeight: '600', color: app.ink }}>{b.store.name}</Text>
              <Text style={{ fontSize: fs(12), color: app.inkSoft }}>{b.store.sub}</Text>
            </View>
            <ChevronRight size={18} color={app.inkSoft} />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
