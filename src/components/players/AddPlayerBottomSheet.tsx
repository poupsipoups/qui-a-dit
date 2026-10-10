import { BottomSheet, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { AvatarImage, PillButton } from '@/components/design';
import { persistPlayerPhoto, pickPlayerPhoto } from '@/features/players/photo';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

function createPlayerId() { return `player-${Date.now()}-${Math.random().toString(36).slice(2)}`; }

export function AddPlayerBottomSheet({ visible, onClose, onOpen, onAddPlayer }: { visible: boolean; onClose: () => void; onOpen: () => void; onAddPlayer: (player: Player) => Promise<void> }) {
  const [name, setName] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const close = () => { if (!saving) onClose(); };
  const choosePhoto = async (source: 'library' | 'camera') => {
    onClose();
    await new Promise((resolve) => setTimeout(resolve, 350));
    try { const uri = await pickPlayerPhoto(source); if (uri) setPhotoUri(uri); }
    catch (error) { Alert.alert('Photo indisponible', error instanceof Error ? error.message : 'Réessaie dans un instant.'); }
    finally { onOpen(); }
  };
  const save = async () => {
    const cleanName = name.trim();
    if (!cleanName) return Alert.alert('Il manque un prénom', 'Ajoute le prénom du joueur.');
    if (cleanName.length > 40) return Alert.alert('Prénom trop long', 'Choisis un prénom de 40 caractères maximum.');
    const id = createPlayerId();
    setSaving(true);
    try {
      const savedPhoto = photoUri ? await persistPlayerPhoto(photoUri, id) : undefined;
      await onAddPlayer({ id, name: cleanName, photoUri: savedPhoto, createdAt: new Date().toISOString() });
      setName(''); setPhotoUri(null); onClose();
    } catch { Alert.alert('Impossible d’ajouter ce joueur', 'La photo n’a pas pu être enregistrée.'); }
    finally { setSaving(false); }
  };

  return <BottomSheet index={visible ? 0 : -1} onClose={onClose} snapPoints={['50%', '90%']} enablePanDownToClose backgroundStyle={{ backgroundColor: Colors.sheet }}><BottomSheetView style={styles.host}><KeyboardAwareScrollView bottomOffset={Spacing.lg} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}><Text style={styles.title}>Nouveau joueur</Text><Pressable accessibilityRole="button" accessibilityLabel="Ajouter une photo" onPress={() => choosePhoto('library')} style={styles.photoPicker}><AvatarImage uri={photoUri ?? undefined} name={name} size={108} /></Pressable><View style={styles.photoActions}><Pressable accessibilityRole="button" hitSlop={14} onPress={() => choosePhoto('library')}><Text style={styles.link}>Galerie</Text></Pressable><Text style={styles.dot}>·</Text><Pressable accessibilityRole="button" hitSlop={14} onPress={() => choosePhoto('camera')}><Text style={styles.link}>Appareil photo</Text></Pressable></View><TextInput value={name} onChangeText={setName} placeholder="Prénom" placeholderTextColor={Colors.muted} autoCapitalize="words" maxLength={40} style={styles.input} /><View style={styles.buttons}><PillButton label="Annuler" secondary onPress={close} /><PillButton label={saving ? 'Ajout…' : 'Ajouter'} onPress={save} disabled={saving} /></View></KeyboardAwareScrollView></BottomSheetView></BottomSheet>;
}

const styles = StyleSheet.create({
  host: { flex: 1, width: '100%' }, content: { width: '100%', flexGrow: 1, padding: Spacing.lg, gap: Spacing.md, justifyContent: 'center' }, title: { color: Colors.ink, ...Type.title, textAlign: 'center' }, photoPicker: { alignSelf: 'center', width: 108, height: 108, borderRadius: 54, backgroundColor: Colors.sky, alignItems: 'center', justifyContent: 'center' }, photoPickerText: { color: Colors.ink, ...Type.label, textAlign: 'center', paddingHorizontal: Spacing.sm }, photoActions: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.sm }, link: { color: Colors.action, ...Type.label }, dot: { color: Colors.muted }, input: { minHeight: 54, borderRadius: 18, backgroundColor: Colors.white, paddingHorizontal: Spacing.md, color: Colors.ink, ...Type.body }, buttons: { flexDirection: 'row', gap: Spacing.sm },
});
