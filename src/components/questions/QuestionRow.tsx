import { Pressable, StyleSheet, Switch, Text } from 'react-native';

import { Colors, Spacing, Type } from '@/theme/tokens';

/** Ligne d'une question : toute la ligne bascule, la question désactivée s'estompe. S'empile dans un groupe (voir `QuestionGroup`). */
export function QuestionRow({ text, enabled, onToggle, last }: { text: string; enabled: boolean; onToggle: () => void; last: boolean }) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      accessibilityLabel={text}
      onPress={onToggle}
      style={({ pressed }) => [styles.row, !last && styles.divider, pressed && styles.pressed]}>
      <Text style={[styles.text, !enabled && styles.textOff]}>{text}</Text>
      <Switch value={enabled} onValueChange={onToggle} trackColor={{ false: Colors.switchOff, true: Colors.action }} thumbColor={Colors.white} style={styles.switch} accessibilityElementsHidden importantForAccessibility="no-hide-descendants" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { minHeight: 68, flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.sm + 2, paddingHorizontal: Spacing.md },
  divider: { borderBottomWidth: 1, borderBottomColor: Colors.hairline },
  pressed: { backgroundColor: 'rgba(20, 27, 102, 0.05)' },
  text: { flex: 1, color: Colors.ink, ...Type.body },
  textOff: { opacity: 0.4 },
  switch: { transform: [{ scale: 0.85 }] },
});
