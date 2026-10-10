import { Pressable, StyleSheet, Text } from 'react-native';

import { AvatarImage, CandyCard } from '@/components/design';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

const tones = ['white', 'cream'] as const;

export function PlayerCard({ player, index, onEdit, onRemove }: { player: Player; index: number; onEdit: (player: Player) => void; onRemove: (player: Player) => void }) {
  return <CandyCard tone={tones[index % tones.length]} style={styles.card}><AvatarImage uri={player.photoUri} name={player.name} size={64} /><Text style={styles.name}>{player.name}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Modifier ${player.name}`} onPress={() => onEdit(player)} hitSlop={14} style={styles.actionHit}><Text style={styles.action}>Modifier</Text></Pressable><Pressable accessibilityRole="button" accessibilityLabel={`Retirer ${player.name}`} onPress={() => onRemove(player)} hitSlop={14} style={styles.actionHit}><Text style={styles.action}>Retirer</Text></Pressable></CandyCard>;
}

const styles = StyleSheet.create({ card: { minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }, name: { color: Colors.ink, ...Type.heading, flex: 1 }, actionHit: { minHeight: 44, justifyContent: 'center' }, action: { color: Colors.ink, ...Type.caption } });
