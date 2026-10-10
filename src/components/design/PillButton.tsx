import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Radius, Spacing, Type } from '@/theme/tokens';

type Props = { label: string; onPress: () => void; disabled?: boolean; secondary?: boolean; onDark?: boolean };

/** Bleu = action principale ; blanc = secondaire ; anis = action sur un écran bleu (`onDark`). */
export function PillButton({ label, onPress, disabled = false, secondary = false, onDark = false }: Props) {
  const surface = disabled ? styles.disabled : onDark ? styles.onDark : secondary ? styles.secondary : styles.primary;
  const text = disabled ? styles.textDisabled : onDark || secondary ? styles.textDark : styles.textLight;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, surface, pressed && !disabled && styles.pressed]}>
      <Text style={[styles.text, text]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, paddingHorizontal: Spacing.lg },
  primary: { backgroundColor: Colors.action },
  secondary: { backgroundColor: Colors.white },
  onDark: { backgroundColor: Colors.anis },
  disabled: { backgroundColor: Colors.disabled },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  text: { ...Type.heading, fontSize: 18, lineHeight: 24, fontWeight: '700' },
  textLight: { color: Colors.white },
  textDark: { color: Colors.ink },
  textDisabled: { color: Colors.onDisabled },
});
