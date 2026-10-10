import { Pressable, StyleSheet, Text } from 'react-native';

import { AvatarImage, CandyCard } from '@/components/design';
import type { Player } from '@/features/players/types';
import { Colors, Spacing } from '@/theme/tokens';

const tones = ['yellow', 'mint', 'lavender', 'white'] as const;

export function PlayerCard({ player, index, onRemove }: { player: Player; index: number; onRemove: (player: Player) => void }) {
  return <CandyCard tone={tones[index % tones.length]} style={styles.card}><AvatarImage uri={player.photoUri} name={player.name} size={64} /><Text style={styles.name}>{player.name}</Text><Pressable accessibilityRole="button" onPress={() => onRemove(player)} hitSlop={12}><Text style={styles.remove}>Retirer</Text></Pressable></CandyCard>;
}

const styles = StyleSheet.create({ card: { minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }, name: { color: Colors.ink, fontSize: 20, fontWeight: '700', flex: 1 }, remove: { color: Colors.berry, fontSize: 13, fontWeight: '700' } });
