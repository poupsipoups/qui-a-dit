import { StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { CandyCard, Character, PillButton } from '@/components/design';
import { Colors, Spacing, Type, Fonts } from '@/theme/tokens';

type Props = { question: string; draft: string; onChange: (value: string) => void; onSubmit: () => void };

export function AnswerPhase({ question, draft, onChange, onSubmit }: Props) {
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.screen}>
      <View style={styles.face}><Character expression="hush" background="pink" size={120} /></View>
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
      <View style={styles.spacer} />
      <PillButton label="Valider et passer le téléphone" disabled={!draft.trim()} onPress={onSubmit} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: Spacing.lg, gap: Spacing.sm },
  spacer: { flex: 1 },
  face: { alignItems: 'center' },
  card: { padding: Spacing.md },
  question: { color: Colors.ink, ...Type.answer },
  input: { height: 92, padding: Spacing.md, borderRadius: 24, backgroundColor: Colors.white, color: Colors.ink, ...Type.heading, fontFamily: Fonts.medium, textAlignVertical: 'top' },
  count: { color: Colors.muted, ...Type.caption, alignSelf: 'flex-end' },
});
