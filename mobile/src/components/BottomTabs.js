import { Pressable, Text, View } from 'react-native';
import { Home as HomeIcon, List, Settings as SettingsIcon } from 'lucide-react-native';

const TABS = [
  { id: 'home', label: '홈', Icon: HomeIcon },
  { id: 'orders', label: '내 주문', Icon: List },
  { id: 'settings', label: '설정', Icon: SettingsIcon },
];

export function BottomTabs({ app, screen, onSelect }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: app.border, paddingVertical: 10 }}>
      {TABS.map((t) => {
        const active = screen === t.id;
        const color = active ? app.practice : app.inkSoft;
        return (
          <Pressable key={t.id} onPress={() => onSelect(t.id)} style={{ alignItems: 'center', gap: 2 }}>
            <t.Icon size={20} color={color} />
            <Text style={{ fontSize: 10, color }}>{t.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
