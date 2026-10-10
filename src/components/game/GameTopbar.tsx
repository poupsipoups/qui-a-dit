import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, Type } from '@/theme/tokens';

export function GameTopbar({ label, onLeave, onDark = false }: { label: string; onLeave?: () => void; onDark?: boolean }) {
  return (
    <View style={styles.bar}>
      <Text style={[styles.label, onDark && styles.onDark]}>{label}</Text>
      {onLeave && (
        <Pressable accessibilityRole="button" accessibilityLabel="Quitter la partie" onPress={onLeave} hitSlop={8} style={styles.quitHit}>
          <Text style={[styles.quit, onDark && styles.onDark]}>Quitter</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { minHeight: 56, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { color: Colors.ink, ...Type.label, fontWeight: '800' },
  quitHit: { minHeight: 44, minWidth: 44, justifyContent: 'center', alignItems: 'flex-end' },
  quit: { color: Colors.ink, ...Type.label },
  onDark: { color: Colors.white },
});
