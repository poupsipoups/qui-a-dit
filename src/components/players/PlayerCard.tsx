import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AvatarImage, CandyCard } from '@/components/design';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

const tones = ['white', 'cream'] as const;
const ICON_COLOR = 'rgba(20, 27, 102, 0.6)';

/** Glyphe discret (encre à 60 %) dans une cible tactile de 44 pt ; Feather a des bouts arrondis, plus ludiques que des icônes d'outil. */
function IconButton({ icon, label, onPress }: { icon: 'edit-2' | 'trash-2'; label: string; onPress: () => void }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.iconHit, pressed && styles.iconPressed]}><Feather name={icon} size={21} color={ICON_COLOR} /></Pressable>;
}

export function PlayerCard({ player, index, onEdit, onRemove }: { player: Player; index: number; onEdit: (player: Player) => void; onRemove: (player: Player) => void }) {
  return <CandyCard tone={tones[index % tones.length]} style={styles.card}><AvatarImage uri={player.photoUri} seed={player.id} character={player.character} size={64} /><Text style={styles.name}>{player.name}</Text><View style={styles.actions}><IconButton icon="edit-2" label={`Modifier ${player.name}`} onPress={() => onEdit(player)} /><IconButton icon="trash-2" label={`Retirer ${player.name}`} onPress={() => onRemove(player)} /></View></CandyCard>;
}

const styles = StyleSheet.create({ card: { minHeight: 88, flexDirection: 'row', alignItems: 'center', gap: Spacing.md }, name: { color: Colors.ink, ...Type.heading, flex: 1 }, actions: { flexDirection: 'row' }, iconHit: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }, iconPressed: { opacity: 0.5 } });
