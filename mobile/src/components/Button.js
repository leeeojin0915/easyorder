import { Pressable, View } from 'react-native';

export function Button({ children, onPress, variant = 'default', disabled, style, app }) {
  const base = {
    height: 48, borderRadius: 12,
    borderWidth: 1, borderColor: app.border, backgroundColor: app.surface,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    opacity: disabled ? 0.45 : 1,
  };
  const variants = {
    primary: { backgroundColor: app.ink, borderWidth: 0 },
    realtime: { backgroundColor: app.realtime, borderWidth: 0 },
    outlineRealtime: { borderWidth: 1, borderColor: app.realtime, backgroundColor: 'transparent' },
    ghost: { backgroundColor: 'transparent', borderWidth: 0 },
  };

  return (
    <Pressable onPress={disabled ? undefined : onPress} disabled={disabled} style={[base, variants[variant] || {}, style]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>{children}</View>
    </Pressable>
  );
}

export const BUTTON_TEXT_COLOR = {
  default: (app) => app.ink,
  primary: () => '#fff',
  realtime: () => '#fff',
  outlineRealtime: (app) => app.realtime,
  ghost: (app) => app.inkSoft,
};
