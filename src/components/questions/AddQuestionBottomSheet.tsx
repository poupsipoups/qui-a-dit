import { BottomSheet, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { PillButton } from '@/components/design';
import { Colors, Spacing, Type } from '@/theme/tokens';

export function AddQuestionBottomSheet({ visible, onClose, onAdd }: { visible: boolean; onClose: () => void; onAdd: (text: string) => Promise<'added' | 'duplicate'> }) {
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const submit = async () => {
    const cleaned = text.trim();
    if (cleaned.length < 8) return Alert.alert('Un peu courte', 'Écris une vraie question, avec au moins 8 caractères.');
    if (cleaned.length > 180) return Alert.alert('Un peu longue', 'Garde une question de 180 caractères maximum.');
    setSaving(true);
    const result = await onAdd(cleaned);
    setSaving(false);
    if (result === 'duplicate') return Alert.alert('Déjà dans la boîte', 'Cette question existe déjà.');
    setText(''); onClose();
  };
  return <BottomSheet index={visible ? 0 : -1} onClose={onClose} snapPoints={['50%', '90%']} enablePanDownToClose backgroundStyle={{ backgroundColor: Colors.sheet }}><BottomSheetView style={styles.host}><KeyboardAwareScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled"><Text style={styles.title}>Proposer une question</Text><Text style={styles.detail}>Une nouvelle question pour votre prochaine partie.</Text><TextInput value={text} onChangeText={setText} placeholder="Ex. Quel est ton pire achat ?" placeholderTextColor={Colors.muted} multiline maxLength={180} style={styles.input} /><View style={styles.buttons}><PillButton label="Annuler" secondary onPress={onClose} /><PillButton label={saving ? 'Ajout…' : 'Ajouter'} onPress={submit} disabled={saving} /></View></KeyboardAwareScrollView></BottomSheetView></BottomSheet>;
}

const styles = StyleSheet.create({ host: { flex: 1, width: '100%' }, content: { flexGrow: 1, padding: Spacing.lg, gap: Spacing.md, justifyContent: 'center' }, title: { ...Type.title, color: Colors.ink }, detail: { color: Colors.muted, ...Type.body, fontWeight: '500' }, input: { minHeight: 100, textAlignVertical: 'top', padding: Spacing.md, backgroundColor: Colors.white, borderRadius: 20, color: Colors.ink, ...Type.body }, buttons: { flexDirection: 'row', gap: Spacing.sm } });
