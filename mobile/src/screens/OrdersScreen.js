import { Pressable, ScrollView, Text, View } from 'react-native';
import { ClipboardCheck, Trash2 } from 'lucide-react-native';
import { cartSummaryLine } from '../lib/content';

export function OrdersScreen({ app, settings, fs, savedOrders, onDelete }) {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: fs(19), fontWeight: '600', color: app.ink, marginBottom: 16 }}>내 주문</Text>
      {savedOrders.length === 0 && (
        <Text style={{ fontSize: fs(13), color: app.inkSoft, textAlign: 'center', paddingVertical: 40 }}>
          아직 저장된 주문이 없어요.{'\n'}연습을 완료하면 여기에 저장할 수 있어요.
        </Text>
      )}
      {savedOrders.map((o) => (
        <View key={o.id} style={{
          flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: app.bg, borderRadius: 12,
          padding: 14, marginBottom: 10, borderWidth: settings.highContrast ? 1 : 0, borderColor: app.border,
        }}>
          <ClipboardCheck size={18} color={app.practice} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: fs(14), fontWeight: '600', color: app.ink }}>{o.nickname}</Text>
            <Text style={{ fontSize: fs(11), color: app.inkSoft }} numberOfLines={1} ellipsizeMode="tail">
              {o.storeName} · {cartSummaryLine(o.cart)}
            </Text>
          </View>
          <Pressable onPress={() => onDelete(o.id)}>
            <Trash2 size={17} color={app.inkSoft} />
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}
