import { StyleSheet, Text, TextInput } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { CandyCard, PillButton } from '@/components/design';
import { Colors, Spacing, Type } from '@/theme/tokens';

type Props = { question: string; draft: string; onChange: (value: string) => void; onSubmit: () => void };

export function AnswerPhase({ question, draft, onChange, onSubmit }: Props) {
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.screen}>
      <CandyCard style={styles.card}>
        <Text style={styles.question}>{question}</Text>
      </CandyCard>
      <TextInput
        accessibilityLabel="Ta réponse"
        value={draft}
        onChangeText={onChange}
        placeholder="Ta réponse, sans te faire griller…"
        placeholderTextColor={Colors.muted}
        multiline
        autoFocus
        returnKeyType="done"
        submitBehavior="blurAndSubmit"
        maxLength={280}
        style={styles.input}
      />
      <Text style={styles.count}>{draft.length}/280</Text>
      <PillButton label="Valider et passer le téléphone" disabled={!draft.trim()} onPress={onSubmit} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: Spacing.lg, gap: Spacing.md },
  card: { padding: Spacing.lg },
  question: { color: Colors.ink, ...Type.answer },
  input: { flex: 1, minHeight: 120, padding: Spacing.md, borderRadius: 24, backgroundColor: Colors.white, color: Colors.ink, ...Type.heading, fontWeight: '500', textAlignVertical: 'top' },
  count: { color: Colors.muted, ...Type.caption, alignSelf: 'flex-end' },
});
