import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AvatarImage, CandyCard } from '@/components/design';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

const tones = ['white', 'cream'] as const;

/** Pastille de 44 pt (cible tactile HIG) : la teinte donne du corps au glyphe, qui reste fin à côté des titres gras. */
function IconButton({ icon, label, onPress }: { icon: 'pencil' | 'trash'; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.iconHit, { backgroundColor: icon === 'pencil' ? Colors.sky : Colors.background }, pressed && styles.iconPressed]}><Ionicons name={icon} size={20} color={Colors.ink} /></Pressable>;
}

export function PlayerCard({ player, index, onEdit, onRemove }: { player: Player; index: number; onEdit: (player: Player) => void; onRemove: (player: Player) => void }) {
  return <CandyCard tone={tones[index % tones.length]} style={styles.card}><AvatarImage uri={player.photoUri} seed={player.id} character={player.character} size={64} /><Text style={styles.name}>{player.name}</Text><IconButton icon="pencil" label={`Modifier ${player.name}`} onPress={() => onEdit(player)} /><IconButton icon="trash" label={`Retirer ${player.name}`} onPress={() => onRemove(player)} /></CandyCard>;
}

const styles = StyleSheet.create({ card: { minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }, name: { color: Colors.ink, ...Type.heading, flex: 1 }, iconHit: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }, iconPressed: { transform: [{ scale: 0.94 }], opacity: 0.85 } });
