import { StyleSheet, Text, View } from 'react-native';

import { CandyCard, Mascot, PillButton } from '@/components/design';
import { Colors, Spacing, Type } from '@/theme/tokens';

/** Moment commun, plein bleu : la question est lue à voix haute avant que le téléphone circule. */
export function IntroPhase({ question, onStart }: { question: string; onStart: () => void }) {
  return (
    <View style={styles.screen}>
      <Mascot size={88} />
      <Text style={styles.title}>Voici la question</Text>
      <CandyCard tone="sky" style={styles.card}>
        <Text style={styles.question}>{question}</Text>
      </CandyCard>
      <Text style={styles.hint}>Lisez-la à voix haute, puis chacun répond en secret.</Text>
      <PillButton label="C’est parti" onDark onPress={onStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: 'center', alignItems: 'stretch', padding: Spacing.lg, gap: Spacing.lg },
  title: { color: Colors.white, ...Type.title, textAlign: 'center' },
  card: { padding: Spacing.xl },
  question: { color: Colors.ink, ...Type.answer, textAlign: 'center' },
  hint: { color: Colors.white, ...Type.body, textAlign: 'center' },
});
