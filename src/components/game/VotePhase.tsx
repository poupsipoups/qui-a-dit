import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AvatarImage, CandyCard, Character, PillButton } from '@/components/design';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

type Props = { answer: string; players: Player[]; availableIds: string[]; onVote: (id: string) => void; onUndo?: () => void };

export function VotePhase({ answer, players, availableIds, onVote, onUndo }: Props) {
  const forced = availableIds.length === 1;
  const forcedPlayer = players.find((player) => player.id === availableIds[0]);
  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <View style={styles.face}><Character expression="thinking" background="cream" size={110} /></View>
      <Text style={styles.title}>Qui a dit…</Text>
      <CandyCard tone="white" style={styles.answerCard}>
        <Text style={styles.answer}>“{answer}”</Text>
      </CandyCard>
      {forced ? (
        <CandyCard tone="sky" style={styles.forced}>
          <Text style={styles.forcedLabel}>Plus qu’une personne possible</Text>
          {forcedPlayer && <AvatarImage uri={forcedPlayer.photoUri} name={forcedPlayer.name} size={120} fill={Colors.white} />}
          <Text style={styles.forcedName}>{forcedPlayer?.name}</Text>
          <PillButton label="Valider ce dernier choix" onPress={() => onVote(availableIds[0])} />
        </CandyCard>
      ) : (
        <View style={styles.grid}>
          {players.map((player) => {
            const available = availableIds.includes(player.id);
            return (
              <Pressable
                key={player.id}
                accessibilityRole="button"
                accessibilityLabel={available ? player.name : `${player.name}, déjà attribué`}
                accessibilityState={{ disabled: !available }}
                disabled={!available}
                onPress={() => onVote(player.id)}
                style={styles.choice}>
                <AvatarImage uri={player.photoUri} name={player.name} size={96} disabled={!available} />
                <Text style={[styles.name, !available && styles.nameDisabled]} numberOfLines={2}>{player.name}</Text>
              </Pressable>
            );
          })}
        </View>
      )}
      {onUndo && <PillButton label="Modifier le vote précédent" secondary onPress={onUndo} />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { padding: Spacing.lg, gap: Spacing.lg },
  face: { alignItems: 'center', marginBottom: -Spacing.sm },
  title: { color: Colors.ink, ...Type.title, textAlign: 'center' },
  answerCard: { padding: Spacing.lg },
  answer: { color: Colors.ink, ...Type.answer, textAlign: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', rowGap: Spacing.lg, columnGap: Spacing.sm },
  choice: { width: '31%', minHeight: 44, alignItems: 'center', gap: Spacing.xs },
  name: { color: Colors.ink, ...Type.body, fontWeight: '700', textAlign: 'center' },
  nameDisabled: { color: Colors.muted },
  forced: { alignItems: 'center', gap: Spacing.sm },
  forcedLabel: { color: Colors.muted, ...Type.label },
  forcedName: { color: Colors.ink, ...Type.hero },
});
