import { StyleSheet, Text, View } from 'react-native';

import { AvatarImage, CandyCard, PillButton } from '@/components/design';
import type { Player } from '@/features/players/types';
import { Colors, Spacing } from '@/theme/tokens';

type Props = { answer: string; guessed?: Player; author?: Player; isLast: boolean; onNext: () => void };

export function RevealPhase({ answer, guessed, author, isLast, onNext }: Props) {
  const correct = !!guessed && guessed.id === author?.id;
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>La vérité…</Text>
      <CandyCard tone="white" style={styles.answerCard}>
        <Text style={styles.answer}>“{answer}”</Text>
      </CandyCard>
      <CandyCard tone={correct ? 'mint' : 'yellow'} style={styles.result}>
        <Text style={styles.label}>Vous aviez choisi</Text>
        <Text style={styles.guessed}>{guessed?.name ?? 'personne'}</Text>
        <Text style={styles.label}>En réalité, c’était</Text>
        <View style={styles.authorLine}>
          {author && <AvatarImage uri={author.photoUri} name={author.name} size={52} />}
          <Text style={styles.author}>{author?.name}</Text>
        </View>
        <Text style={styles.mark}>{correct ? 'Bien vu !' : 'Pas du tout !'}</Text>
      </CandyCard>
      <PillButton label={isLast ? 'Voir la fin' : 'Révélation suivante'} onPress={onNext} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: Spacing.lg, gap: Spacing.lg, justifyContent: 'center' },
  title: { color: Colors.ink, fontSize: 34, fontWeight: '800', textAlign: 'center' },
  answerCard: { padding: Spacing.lg },
  answer: { color: Colors.ink, fontSize: 23, fontWeight: '700', lineHeight: 31, textAlign: 'center' },
  result: { alignItems: 'center', gap: Spacing.xs },
  label: { color: Colors.muted, fontSize: 14, fontWeight: '700' },
  guessed: { color: Colors.ink, fontSize: 22, fontWeight: '800' },
  authorLine: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm },
  author: { color: Colors.ink, fontSize: 30, fontWeight: '800' },
  mark: { color: Colors.berry, marginTop: Spacing.sm, fontSize: 17, fontWeight: '800' },
});
