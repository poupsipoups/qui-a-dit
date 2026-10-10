import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';

import { AvatarImage, CandyCard, PillButton } from '@/components/design';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

type Props = { answer: string; guessed?: Player; author?: Player; isLast: boolean; onNext: () => void };

/** Deux temps : le choix du groupe, puis la vérité. L’animation respecte « Réduire les animations » (comportement par défaut de Reanimated). */
export function RevealPhase({ answer, guessed, author, isLast, onNext }: Props) {
  const [revealed, setRevealed] = useState(false);
  const correct = !!guessed && guessed.id === author?.id;

  const reveal = () => {
    void Haptics.notificationAsync(correct ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
    setRevealed(true);
  };

  return (
    <View style={styles.screen}>
      <CandyCard tone="white" style={styles.answerCard}>
        <Text style={styles.answer}>“{answer}”</Text>
      </CandyCard>
      {!revealed ? (
        <>
          <CandyCard tone="lavender" style={styles.choice}>
            <Text style={styles.label}>Vous aviez choisi</Text>
            {guessed && <AvatarImage uri={guessed.photoUri} name={guessed.name} size={110} />}
            <Text style={styles.guessed}>{guessed?.name ?? 'personne'}</Text>
          </CandyCard>
          <PillButton label="Révéler" onPress={reveal} />
        </>
      ) : (
        <>
          <Animated.View entering={ZoomIn.springify().damping(14)}>
            <CandyCard tone={correct ? 'mint' : 'yellow'} style={styles.result}>
              <Text style={styles.label}>{correct ? 'Bien vu, c’était…' : 'En réalité, c’était…'}</Text>
              {author && <AvatarImage uri={author.photoUri} name={author.name} size={180} />}
              <Text style={styles.author}>{author?.name}</Text>
              <Animated.Text entering={FadeIn.delay(250)} style={styles.mark}>
                {correct ? 'Le groupe a trouvé !' : 'Raté, pas du tout !'}
              </Animated.Text>
            </CandyCard>
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
  result: { alignItems: 'center', gap: Spacing.sm, paddingVertical: Spacing.xl },
  label: { color: Colors.muted, ...Type.label },
  guessed: { color: Colors.ink, ...Type.title },
  author: { color: Colors.ink, ...Type.hero },
  mark: { color: Colors.berry, ...Type.heading },
});
