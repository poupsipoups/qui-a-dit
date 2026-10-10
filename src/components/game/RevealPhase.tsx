import * as Haptics from 'expo-haptics';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { AvatarImage, CandyCard, Character, PillButton } from '@/components/design';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

type Props = { answer: string; guessed?: Player; author?: Player; revealed: boolean; isLast: boolean; onReveal: () => void; onNext: () => void };

/** Deux temps : le choix du groupe, puis la vérité (le fond de l’écran passe en anis ou en orange, géré par `game.tsx`). */
export function RevealPhase({ answer, guessed, author, revealed, isLast, onReveal, onNext }: Props) {
  const correct = !!guessed && guessed.id === author?.id;

  const reveal = () => {
    void Haptics.notificationAsync(correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
    onReveal();
  };

  return (
    <View style={styles.screen}>
      <CandyCard tone="white" style={styles.answerCard}>
        <Text style={styles.answer}>“{answer}”</Text>
      </CandyCard>
      {!revealed ? (
        <>
          <CandyCard tone="sky" style={styles.choice}>
            <Text style={styles.label}>Vous aviez choisi</Text>
            {guessed && <AvatarImage uri={guessed.photoUri} name={guessed.name} size={110} fill={Colors.white} />}
            <Text style={styles.guessed}>{guessed?.name ?? 'personne'}</Text>
          </CandyCard>
          <PillButton label="Révéler" onPress={reveal} />
        </>
      ) : (
        <>
          <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.result}>
            <Character expression={correct ? 'laugh' : 'shock'} background={correct ? 'anis' : 'orange'} size={120} />
            <Text style={styles.resultLabel}>{correct ? 'Bien vu, c’était…' : 'Raté, c’était…'}</Text>
            {author && <AvatarImage uri={author.photoUri} name={author.name} size={180} />}
            <Text style={styles.author}>{author?.name}</Text>
            <Animated.Text entering={FadeIn.delay(250)} style={styles.mark}>
              {correct ? 'Le groupe a trouvé !' : 'Personne n’y avait pensé !'}
            </Animated.Text>
          </Animated.View>
          <PillButton label={isLast ? 'Voir la fin' : 'Révélation suivante'} onPress={onNext} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: Spacing.lg, gap: Spacing.lg, justifyContent: 'center' },
  answerCard: { padding: Spacing.lg },
  answer: { color: Colors.ink, ...Type.answer, textAlign: 'center' },
  choice: { alignItems: 'center', gap: Spacing.sm },
  result: { alignItems: 'center', gap: Spacing.sm },
  label: { color: Colors.muted, ...Type.label },
  resultLabel: { color: Colors.ink, ...Type.heading },
  guessed: { color: Colors.ink, ...Type.title },
  author: { color: Colors.ink, ...Type.hero },
  mark: { color: Colors.ink, ...Type.heading },
});
