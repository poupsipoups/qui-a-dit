import type { ReactNode } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Colors, Fonts, Spacing, Type } from '@/theme/tokens';
import { CandyCard } from './CandyCard';

export function EmptyState({ title, detail, action }: { title: string; detail: string; action?: ReactNode }) {
  return <CandyCard tone="white" style={styles.card}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text>{action}</CandyCard>;
}

const styles = StyleSheet.create({ card: { gap: Spacing.sm, alignItems: 'flex-start' }, title: { color: Colors.ink, ...Type.heading }, detail: { color: Colors.muted, ...Type.body, fontFamily: Fonts.medium } });
