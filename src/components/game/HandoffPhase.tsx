import { StyleSheet, Text, View } from 'react-native';

import { AvatarImage, CandyCard, Character, PillButton } from '@/components/design';
import { characterPalette } from '@/components/design/PlayerCharacter';
import { characterOf } from '@/features/players/character';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

export function HandoffPhase({ player, tone, onReady }: { player: Player; tone: 'sky' | 'anis'; onReady: () => void }) {
  // Sans photo, la carte reprend la couleur du personnage ; le nom suit le trait du personnage pour rester lisible (blanc sur bleu).
  const palette = player.photoUri ? null : characterPalette(characterOf(player));
  return (
    <View style={styles.screen}>
      <View style={styles.face}><Character expression="hush" background="pink" size={130} /></View>
      <Text style={styles.label}>Passe le téléphone à</Text>
      <CandyCard tone={tone} style={[styles.card, palette && { backgroundColor: palette.bg }]}>
        <AvatarImage uri={player.photoUri} seed={player.id} character={player.character} size={180} />
        <Text style={[styles.name, palette && { color: palette.line }]}>{player.name}</Text>
      </CandyCard>
      <Text style={styles.hint}>Personne ne regarde la suite</Text>
      <PillButton label="C’est moi" onPress={onReady} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'stretch', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.lg },
  face: { alignItems: 'center' },
  label: { color: Colors.ink, ...Type.heading, textAlign: 'center' },
  card: { alignItems: 'center', gap: Spacing.md, padding: Spacing.xl },
  name: { color: Colors.ink, ...Type.hero },
  hint: { color: Colors.muted, ...Type.body, textAlign: 'center' },
});
