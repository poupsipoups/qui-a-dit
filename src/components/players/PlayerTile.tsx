import Feather from '@expo/vector-icons/Feather';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AvatarImage } from '@/components/design';
import type { Player } from '@/features/players/types';
import { Colors, Radius, Spacing, Type } from '@/theme/tokens';

/** Tuile-visage du line-up : le visage porte la tuile, le prénom dessous. Toucher ouvre la fiche (modifier / retirer). */
export function PlayerTile({ player, onPress }: { player: Player; onPress: (player: Player) => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Modifier ${player.name}`}
      onPress={() => onPress(player)}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed]}>
      <AvatarImage uri={player.photoUri} seed={player.id} character={player.character} size={88} />
      <Text numberOfLines={1} style={styles.name}>{player.name}</Text>
    </Pressable>
  );
}

export function AddTile({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel="Ajouter un joueur" onPress={onPress} style={({ pressed }) => [styles.tile, styles.add, pressed && styles.pressed]}>
      <View style={styles.plus}><Feather name="plus" size={28} color={Colors.ink} /></View>
      <Text style={styles.addText}>Ajouter</Text>
    </Pressable>
  );
}

/** Place vide qui garde la dernière tuile à la largeur d'une colonne quand le nombre d'éléments est impair. */
export const TileSpacer = () => <View style={styles.spacer} />;

const styles = StyleSheet.create({
  tile: { flex: 1, minHeight: 156, borderRadius: Radius.card, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, padding: Spacing.md },
  pressed: { transform: [{ scale: 0.97 }] },
  name: { color: Colors.ink, ...Type.heading, maxWidth: '100%' },
  add: { backgroundColor: 'transparent', borderWidth: 1.5, borderColor: Colors.hairline, borderStyle: 'dashed' },
  plus: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.55)' },
  addText: { color: Colors.ink, ...Type.label },
  spacer: { flex: 1 },
});
