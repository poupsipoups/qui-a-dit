import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Radius, Spacing } from '@/theme/tokens';

export function PillButton({ label, onPress, disabled = false, secondary = false }: { label: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.button, secondary ? styles.secondary : styles.primary, disabled && styles.disabled, pressed && !disabled && styles.pressed]}><Text style={[styles.text, secondary && styles.secondaryText]}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  button: { minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, paddingHorizontal: Spacing.lg },
  primary: { backgroundColor: Colors.berry }, secondary: { backgroundColor: Colors.white }, disabled: { backgroundColor: Colors.disabled }, pressed: { transform: [{ scale: 0.98 }], opacity: 0.92 },
  text: { color: Colors.white, fontSize: 16, fontWeight: '700' }, secondaryText: { color: Colors.berry },
});
