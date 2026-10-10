import { Pressable, StyleSheet, Text } from 'react-native';

import { AvatarImage, CandyCard } from '@/components/design';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

const tones = ['white', 'cream'] as const;

export function PlayerCard({ player, index, onRemove }: { player: Player; index: number; onRemove: (player: Player) => void }) {
  return <CandyCard tone={tones[index % tones.length]} style={styles.card}><AvatarImage uri={player.photoUri} seed={player.id} size={64} /><Text style={styles.name}>{player.name}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Retirer ${player.name}`} onPress={() => onRemove(player)} hitSlop={14} style={styles.removeHit}><Text style={styles.remove}>Retirer</Text></Pressable></CandyCard>;
}

const styles = StyleSheet.create({ card: { minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }, name: { color: Colors.ink, ...Type.heading, flex: 1 }, removeHit: { minHeight: 44, justifyContent: 'center' }, remove: { color: Colors.ink, ...Type.caption } });
