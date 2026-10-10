import { StyleSheet, Text, View } from 'react-native';

import { AvatarImage, Mascot, PillButton } from '@/components/design';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

type Props = { players: Player[]; found: number; total: number; onReplay: () => void; onHome: () => void };

export function EndPhase({ players, found, total, onReplay, onHome }: Props) {
  return (
    <View style={styles.screen}>
      <Mascot size={96} />
      <Text style={styles.title}>C’est fini !</Text>
      <Text style={styles.detail}>
        Le groupe a trouvé {found} auteur{found > 1 ? 's' : ''} sur {total}.
      </Text>
      <View style={styles.faces}>
        {players.map((player) => <AvatarImage key={player.id} uri={player.photoUri} name={player.name} size={56} />)}
      </View>
      <View style={styles.actions}>
        <PillButton label="Rejouer avec les mêmes" onPress={onReplay} />
        <PillButton label="Retour à l’accueil" secondary onPress={onHome} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.lg },
  title: { color: Colors.ink, ...Type.hero, textAlign: 'center' },
  detail: { color: Colors.muted, ...Type.body, textAlign: 'center' },
  faces: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: Spacing.sm },
  actions: { alignSelf: 'stretch', gap: Spacing.sm, marginTop: Spacing.md },
});
