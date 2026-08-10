import { Pressable, Text, View } from 'react-native';
import { computeCartTotal } from '../lib/content';

export function CartBar({ theme, app, cart, mode, onReview }) {
  if (cart.length === 0) return null;
  const total = computeCartTotal(cart);
  const colors = mode === 'practice' && theme
    ? { bg: theme.card, border: theme.mute + '33', text: theme.text, accent: theme.accent, mute: theme.mute }
    : { bg: app.surface, border: app.border, text: app.ink, accent: app.realtime, mute: app.inkSoft };
  const qty = cart.reduce((n, l) => n + l.qty, 0);
  return (
    <View style={{
      position: mode === 'practice' ? 'absolute' : 'relative', left: 0, right: 0, bottom: 0,
      backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border,
      paddingVertical: 12, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <View>
        <Text style={{ fontSize: 11, color: colors.mute }}>담긴 메뉴 {qty}개</Text>
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text }}>{total.toLocaleString()}원</Text>
      </View>
      <Pressable onPress={onReview} style={{ height: 44, paddingHorizontal: 18, borderRadius: 10, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>장바구니 보기</Text>
      </Pressable>
    </View>
  );
}
