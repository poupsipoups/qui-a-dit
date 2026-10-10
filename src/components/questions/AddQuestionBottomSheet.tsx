import { BottomSheet, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { PillButton } from '@/components/design';
import { Colors, Spacing, Type } from '@/theme/tokens';

const MAX_LENGTH = 180;
const MIN_LENGTH = 8;

export function AddQuestionBottomSheet({ visible, onClose, onAdd }: { visible: boolean; onClose: () => void; onAdd: (text: string) => Promise<'added' | 'duplicate'> }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    const cleaned = text.trim();
    if (cleaned.length < MIN_LENGTH) return Alert.alert('Un peu courte', `Écris une vraie question, avec au moins ${MIN_LENGTH} caractères.`);
    if (cleaned.length > MAX_LENGTH) return Alert.alert('Un peu longue', `Garde une question de ${MAX_LENGTH} caractères maximum.`);
    setSaving(true);
    const result = await onAdd(cleaned);
    setSaving(false);
    if (result === 'duplicate') return Alert.alert('Déjà dans la boîte', 'Cette question existe déjà.');
    setText('');
    onClose();
  };

  return (
    <BottomSheet index={visible ? 0 : -1} onClose={onClose} snapPoints={['50%', '90%']} enablePanDownToClose backgroundStyle={{ backgroundColor: Colors.white }}>
      <BottomSheetView style={styles.host}>
        {/* Aligné en bas : la sheet native réduit déjà sa zone au-dessus du clavier, le champ et les actions restent collés à lui. */}
        <View style={styles.content}>
          <View style={styles.head}>
            <Text style={styles.title}>Proposer une question</Text>
            <Text style={styles.detail}>Une nouvelle question pour votre prochaine partie.</Text>
          </View>

          <View>
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
            <Text style={styles.count}>{text.length}/{MAX_LENGTH}</Text>
          </View>

          <View style={styles.actions}>
            <View style={styles.action}><PillButton label="Annuler" secondary outlined onPress={onClose} /></View>
            <View style={styles.action}><PillButton label={saving ? 'Ajout…' : 'Ajouter'} onPress={submit} disabled={saving} /></View>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, width: '100%' },
  content: { width: '100%', flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.lg, justifyContent: 'flex-end' },
  head: { alignItems: 'center', gap: Spacing.xs },
  title: { color: Colors.ink, ...Type.title, textAlign: 'center' },
  detail: { color: Colors.muted, ...Type.caption, textAlign: 'center' },
  input: { minHeight: 112, borderRadius: 20, backgroundColor: Colors.sky, padding: Spacing.md, color: Colors.ink, ...Type.body, textAlignVertical: 'top' },
  count: { color: Colors.muted, ...Type.caption, alignSelf: 'flex-end', marginTop: Spacing.xs, marginRight: Spacing.xs },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  action: { flex: 1 },
});
