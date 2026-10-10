import { StyleSheet, Text, View } from 'react-native';

import { AvatarImage, CandyCard, PillButton } from '@/components/design';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

export function HandoffPhase({ player, tone, onReady }: { player: Player; tone: 'yellow' | 'mint'; onReady: () => void }) {
  return (
    <View style={styles.screen}>
      <Text style={styles.label}>Passe le téléphone à</Text>
      <CandyCard tone={tone} style={styles.card}>
        <AvatarImage uri={player.photoUri} name={player.name} size={180} />
        <Text style={styles.name}>{player.name}</Text>
      </CandyCard>
      <Text style={styles.hint}>Personne ne regarde la suite 🙈</Text>
      <PillButton label="C’est moi" onPress={onReady} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'stretch', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.lg },
  label: { color: Colors.berry, ...Type.heading, textAlign: 'center' },
  card: { alignItems: 'center', gap: Spacing.md, padding: Spacing.xl },
  name: { color: Colors.ink, ...Type.hero },
  hint: { color: Colors.muted, ...Type.body, textAlign: 'center' },
});
