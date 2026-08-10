import { Pressable, ScrollView, Text, View } from 'react-native';
import { Heart } from 'lucide-react-native';

export function HomeScreen({ app, fs, savedOrders, onPickMode, onOpenOrders }) {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: fs(20), fontWeight: '600', color: app.ink, marginBottom: 4 }}>안녕하세요</Text>
      <Text style={{ fontSize: fs(13), color: app.inkSoft, marginBottom: 28 }}>어떻게 도와드릴까요?</Text>
      <Pressable onPress={() => onPickMode('practice')} style={{ backgroundColor: app.practiceSoft, borderRadius: 18, padding: 20, marginBottom: 14 }}>
        <Text style={{ fontSize: fs(16), fontWeight: '600', color: app.practice, marginBottom: 4 }}>연습하기</Text>
        <Text style={{ fontSize: fs(13), color: app.ink }}>화면이 매장 기계와 똑같이 바뀌어요</Text>
      </Pressable>
      <Pressable onPress={() => onPickMode('realtime')} style={{ backgroundColor: app.realtimeSoft, borderRadius: 18, padding: 20 }}>
        <Text style={{ fontSize: fs(16), fontWeight: '600', color: app.realtime, marginBottom: 4 }}>지금 매장이에요</Text>
        <Text style={{ fontSize: fs(13), color: app.ink }}>키오스크 앞에서 실시간으로 안내받아요</Text>
      </Pressable>
      {savedOrders.length > 0 && (
        <>
          <Text style={{ fontSize: fs(13), color: app.inkSoft, marginTop: 20, marginBottom: 8 }}>저장된 내 주문</Text>
          <Pressable onPress={onOpenOrders} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: app.bg, borderRadius: 12, padding: 14 }}>
            <Heart size={18} color={app.highlight} />
            <Text style={{ fontSize: fs(14), color: app.ink }}>{savedOrders[0].nickname} 외 {Math.max(savedOrders.length - 1, 0)}개</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}
