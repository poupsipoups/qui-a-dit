import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, Radius, Spacing, Type } from '@/theme/tokens';

type Props = { label: string; onPress: () => void; disabled?: boolean; secondary?: boolean; onDark?: boolean; outlined?: boolean };

/** Bleu = action principale ; blanc = secondaire ; anis = action sur un écran bleu (`onDark`). */
export function PillButton({ label, onPress, disabled = false, secondary = false, onDark = false, outlined = false }: Props) {
  const surface = disabled ? styles.disabled : onDark ? styles.onDark : secondary ? styles.secondary : styles.primary;
  const text = disabled ? styles.textDisabled : onDark || secondary ? styles.textDark : styles.textLight;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, surface, outlined && styles.outlined, pressed && !disabled && styles.pressed]}>
      <Text numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75} style={[styles.text, text]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { minHeight: 52, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.pill, paddingHorizontal: Spacing.lg },
  primary: { backgroundColor: Colors.action },
  secondary: { backgroundColor: Colors.white },
  outlined: { borderWidth: 1.5, borderColor: Colors.hairline },
  onDark: { backgroundColor: Colors.anis },
  disabled: { backgroundColor: Colors.disabled },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  text: { ...Type.caps, fontSize: 13, letterSpacing: 1.6 },
  textLight: { color: Colors.white },
  textDark: { color: Colors.ink },
  textDisabled: { color: Colors.onDisabled },
});
