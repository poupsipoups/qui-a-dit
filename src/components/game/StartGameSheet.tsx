import { BottomSheet, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { PillButton } from '@/components/design';
import { MAX_LENGTH, MIN_LENGTH } from '@/components/questions/AddQuestionBottomSheet';
import type { Question } from '@/features/questions/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

type Props = {
  visible: boolean;
  questions: Question[];
  onClose: () => void;
  onRandom: () => void;
  onPick: (question: Question) => void;
  onWrite: (text: string) => void;
};

/** Choix de la question avant la partie : au hasard, dans la liste, ou écrite pour l'occasion. */
export function StartGameSheet({ visible, questions, onClose, onRandom, onPick, onWrite }: Props) {
  const [mode, setMode] = useState<'menu' | 'pick' | 'write'>('menu');
  const [text, setText] = useState('');
  const close = () => { setMode('menu'); setText(''); onClose(); };

  const submit = () => {
    const cleaned = text.trim();
    if (cleaned.length < MIN_LENGTH) return Alert.alert('Un peu courte', `Écris une vraie question, avec au moins ${MIN_LENGTH} caractères.`);
    close();
    onWrite(cleaned);
  };

  return (
    <BottomSheet index={visible ? 0 : -1} onClose={close} snapPoints={mode === 'menu' ? ['42%'] : mode === 'pick' ? ['90%'] : ['60%', '90%']} enablePanDownToClose backgroundStyle={{ backgroundColor: Colors.white }}>
      <BottomSheetView style={styles.host}>
        <View style={styles.content}>
          {mode === 'menu' && (
            <>
              <Text style={styles.title}>Quelle question ?</Text>
              <View style={styles.options}>
                <Option lead title="Au hasard" detail="On pioche pour vous" onPress={() => { close(); onRandom(); }} />
                <Option title="Choisir" detail="Dans la liste des questions" onPress={() => setMode('pick')} />
                <Option title="Écrire la mienne" detail="Rien que pour cette partie" onPress={() => setMode('write')} />
              </View>
            </>
          )}
          {mode === 'pick' && (
            <>
              <Text style={styles.title}>Choisis une question</Text>
              <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
                {questions.map((question) => (
                  <Pressable key={question.id} accessibilityRole="button" onPress={() => { close(); onPick(question); }} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
                    <Text style={styles.rowText}>{question.text}</Text>
                  </Pressable>
                ))}
              </ScrollView>
              <PillButton label="Retour" secondary outlined onPress={() => setMode('menu')} />
            </>
          )}
          {mode === 'write' && (
            <>
              <Text style={styles.title}>Ta question</Text>
              <TextInput
                value={text}
                onChangeText={setText}
                placeholder="Ex. Quel est ton pire achat ?"
                placeholderTextColor={Colors.muted}
                multiline
                maxLength={MAX_LENGTH}
                accessibilityLabel="Ta question"
                style={styles.input}
              />
              <View style={styles.actions}>
                <View style={styles.action}><PillButton label="Retour" secondary outlined onPress={() => setMode('menu')} /></View>
                <View style={styles.action}><PillButton label="C’est parti" onPress={submit} /></View>
              </View>
            </>
          )}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

/** Ligne de choix sans fond : le titre bleu de la première (`lead`) suffit à la distinguer. */
function Option({ title, detail, lead = false, onPress }: { title: string; detail: string; lead?: boolean; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${title}. ${detail}`} onPress={onPress} style={({ pressed }) => [styles.option, pressed && styles.pressed]}>
      <Text style={[styles.optionTitle, lead && styles.optionTitleLead]}>{title}</Text>
      <Text style={styles.optionDetail}>{detail}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, width: '100%' },
  content: { width: '100%', flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.xl, gap: Spacing.md },
  options: { marginTop: Spacing.sm },
  option: { minHeight: 64, justifyContent: 'center', paddingVertical: Spacing.sm, borderTopWidth: 1, borderTopColor: Colors.hairline },
  optionTitle: { color: Colors.ink, ...Type.heading },
  optionTitleLead: { color: Colors.action },
  optionDetail: { color: Colors.muted, ...Type.caption },
  title: { color: Colors.ink, ...Type.title, textAlign: 'center' },
  list: { flex: 1 },
  listContent: { gap: Spacing.sm },
  row: { borderRadius: 20, backgroundColor: Colors.sky, padding: Spacing.md },
  rowText: { color: Colors.ink, ...Type.body },
  pressed: { opacity: 0.6 },
  input: { minHeight: 112, borderRadius: 20, backgroundColor: Colors.sky, padding: Spacing.md, color: Colors.ink, ...Type.body, textAlignVertical: 'top' },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  action: { flex: 1 },
});
