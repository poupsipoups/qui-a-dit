import { StyleSheet, Switch, Text } from 'react-native';

import { CandyCard } from '@/components/design';
import { Colors, Spacing, Type } from '@/theme/tokens';

const tones = ['white', 'yellow', 'lavender', 'mint'] as const;

export function QuestionCard({ id, text, index, enabled, onToggle }: { id: string; text: string; index: number; enabled: boolean; onToggle: () => void }) {
  return <CandyCard tone={tones[index % tones.length]} style={styles.card}><Text style={styles.text}>{text}</Text><Switch value={enabled} onValueChange={onToggle} trackColor={{ false: Colors.switchOff, true: Colors.berry }} thumbColor={Colors.white} accessibilityLabel="Question active" accessibilityHint={text} /></CandyCard>;
}

const styles = StyleSheet.create({ card: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md }, text: { flex: 1, color: Colors.ink, ...Type.body } });
