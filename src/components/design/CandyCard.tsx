import type { PropsWithChildren } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, Radius, Spacing } from '@/theme/tokens';

type CardTone = 'white' | 'cream' | 'sky' | 'anis' | 'orange';

export function CandyCard({ children, tone = 'white', style }: PropsWithChildren<{ tone?: CardTone; style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, { backgroundColor: Colors[tone] }, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: { borderRadius: Radius.card, padding: Spacing.md, shadowColor: Colors.ink, shadowOpacity: 0.08, shadowOffset: { width: 0, height: 7 }, shadowRadius: 18, elevation: 2 },
});
