import { Pressable, Text } from 'react-native';

export function PillButton({ label, onPress, disabled = false, secondary = false }: { label: string; onPress: () => void; disabled?: boolean; secondary?: boolean }) {
  const surface = disabled ? 'bg-disabled' : secondary ? 'bg-white' : 'bg-berry';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      className={`min-h-[52px] items-center justify-center rounded-full px-6 ${surface} ${disabled ? '' : 'active:scale-[0.98] active:opacity-90'}`}>
      <Text className={`text-base font-bold ${secondary && !disabled ? 'text-berry' : 'text-white'}`}>{label}</Text>
    </Pressable>
  );
}
