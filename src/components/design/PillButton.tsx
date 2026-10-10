import { Pressable, Text } from 'react-native';

type Props = { label: string; onPress: () => void; disabled?: boolean; secondary?: boolean; onDark?: boolean };

/** Bleu = action principale ; blanc = secondaire ; anis = action sur un écran bleu (`onDark`). */
export function PillButton({ label, onPress, disabled = false, secondary = false, onDark = false }: Props) {
  const surface = disabled ? 'bg-disabled' : onDark ? 'bg-anis' : secondary ? 'bg-white' : 'bg-action';
  const text = disabled ? 'text-on-disabled' : onDark || secondary ? 'text-ink' : 'text-white';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`min-h-[52px] items-center justify-center rounded-full px-6 ${surface} ${disabled ? '' : 'active:scale-[0.98] active:opacity-90'}`}>
      <Text className={`text-lg font-bold ${text}`}>{label}</Text>
    </Pressable>
  );
}
