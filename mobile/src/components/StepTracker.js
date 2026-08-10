import { ScrollView, Text, View } from 'react-native';
import { ChevronRight, Check } from 'lucide-react-native';
import { PHASES } from '../lib/theme';

export function StepTracker({ theme, currentPhase }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingTop: 12, paddingBottom: 8, paddingHorizontal: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
        {PHASES.map((label, i) => {
          const state = i < currentPhase ? 'done' : i === currentPhase ? 'current' : 'upcoming';
          return (
            <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <View style={{
                width: 15, height: 15, borderRadius: 999, alignItems: 'center', justifyContent: 'center',
                backgroundColor: state === 'upcoming' ? theme.mute + '33' : theme.accent,
              }}>
                {state === 'done' ? (
                  <Check size={9} color="#fff" />
                ) : (
                  <Text style={{ fontSize: 8, fontWeight: '700', color: state === 'upcoming' ? theme.mute : '#fff' }}>{i + 1}</Text>
                )}
              </View>
              <Text style={{ fontSize: 9, color: state === 'current' ? theme.text : theme.mute, fontWeight: state === 'current' ? '700' : '400' }}>{label}</Text>
              {i < PHASES.length - 1 && <ChevronRight size={10} color={theme.mute} />}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
