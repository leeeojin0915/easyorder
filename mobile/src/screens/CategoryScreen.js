import { Pressable, ScrollView, Text, View } from 'react-native';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { StepTracker } from '../components/StepTracker';
import { FoodIcon } from '../components/FoodIcon';
import { CartBar } from '../components/CartBar';
import { getCategories, phaseIndexForScreen } from '../lib/content';

export function PracticeCategoryScreen({ app, fs, brand, brandId, theme, device, cart, onBack, onOpenItem, onGoToCartReview }) {
  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 8 }}>
        <Pressable onPress={onBack} style={{ marginLeft: 10 }}>
          <ArrowLeft size={18} color={theme.mute} />
        </Pressable>
        <View style={{ flex: 1 }}><StepTracker theme={theme} currentPhase={phaseIndexForScreen('category')} /></View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={{ fontSize: fs(19), fontWeight: '600', color: theme.text, marginBottom: 16 }}>{brand.store.name}</Text>
        {getCategories(brandId).map((cat) => (
          <View key={cat.category_id} style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: fs(14), fontWeight: '600', color: theme.text, marginBottom: 10 }}>{cat.label}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              {cat.items.map((item) => {
                const itemWidth = device.orientation === 'landscape' ? '31%' : '48%';
                return (
                  <Pressable key={item.item_id} onPress={() => onOpenItem(cat.category_id, item.item_id)} style={{
                    width: itemWidth, backgroundColor: theme.card, borderRadius: 12, padding: 10, alignItems: 'center',
                    borderWidth: 1, borderColor: theme.mute + '33',
                  }}>
                    <View style={{ width: '100%', aspectRatio: 1, borderRadius: 8, marginBottom: 8, backgroundColor: theme.mute + '18', alignItems: 'center', justifyContent: 'center' }}>
                      <FoodIcon visual={item.visual} size={26} color={theme.mute} />
                    </View>
                    <Text style={{ fontSize: fs(12), fontWeight: '600', color: theme.text }}>{item.label}</Text>
                    <Text style={{ fontSize: fs(10), color: theme.mute, marginTop: 2 }}>{item.base_price.toLocaleString()}원</Text>
                    {item.customize_steps.length === 0 && (
                      <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Plus size={11} color={theme.accent} />
                        <Text style={{ color: theme.accent, fontSize: fs(10), fontWeight: '700' }}>담기</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>
      <CartBar theme={theme} app={app} cart={cart} mode="practice" onReview={onGoToCartReview} />
    </View>
  );
}

export function RealtimeCategoryScreen({ app, fs, brand, brandId, theme, cart, onBack, onOpenItem, onGoToCartReview }) {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: cart.length > 0 ? 90 : 20 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Pressable onPress={onBack}>
            <ArrowLeft size={18} color={app.inkSoft} />
          </Pressable>
          <Text style={{ fontSize: 11, fontWeight: '600', paddingVertical: 3, paddingHorizontal: 9, borderRadius: 6, backgroundColor: app.realtimeSoft, color: app.realtime }}>실시간 안내</Text>
        </View>
        <Text style={{ fontSize: fs(17), fontWeight: '600', color: app.ink, marginBottom: 4 }}>{brand.store.name}</Text>
        <Text style={{ fontSize: fs(12), color: app.inkSoft, marginBottom: 16 }}>지금 눈앞의 기계에서 메뉴를 고르고, 여기서도 같이 담아주세요</Text>
        {getCategories(brandId).map((cat) => (
          <View key={cat.category_id} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: fs(13), fontWeight: '600', color: app.ink, marginBottom: 8 }}>{cat.label}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {cat.items.map((item) => (
                <Pressable key={item.item_id} onPress={() => onOpenItem(cat.category_id, item.item_id)} style={{
                  minWidth: '47%', flex: 1, borderRadius: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: app.bg, borderWidth: 1, borderColor: app.border,
                }}>
                  <Text style={{ fontSize: fs(13), fontWeight: '500', color: app.ink }}>{item.label}</Text>
                  <Text style={{ fontSize: fs(11), color: app.inkSoft }}>{item.base_price.toLocaleString()}원</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      <CartBar theme={null} app={app} cart={cart} mode="realtime" onReview={onGoToCartReview} />
    </View>
  );
}
