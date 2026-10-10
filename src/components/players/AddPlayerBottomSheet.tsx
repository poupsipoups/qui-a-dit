import { BottomSheet, BottomSheetView } from '@expo/ui/community/bottom-sheet';
import Feather from '@expo/vector-icons/Feather';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { AvatarImage, PillButton } from '@/components/design';
import { persistPlayerPhoto, pickPlayerPhoto } from '@/features/players/photo';
import { characterOf, pickCharacter } from '@/features/players/character';
import type { Player } from '@/features/players/types';
import { Colors, Radius, Spacing, Type } from '@/theme/tokens';

function createPlayerId() { return `player-${Date.now()}-${Math.random().toString(36).slice(2)}`; }

export function AddPlayerBottomSheet({ visible, players, editing = null, onClose, onOpen, onAddPlayer, onUpdatePlayer, onRemove }: { visible: boolean; players: readonly Player[]; editing?: Player | null; onClose: () => void; onOpen: () => void; onAddPlayer: (player: Player) => Promise<void>; onUpdatePlayer: (player: Player) => Promise<void>; onRemove?: (player: Player) => void }) {
  // Le parent change la `key` quand `editing` change : l'état initial suffit.
  const [name, setName] = useState(editing?.name ?? '');
  const [photoUri, setPhotoUri] = useState<string | null>(editing?.photoUri ?? null);
  const [saving, setSaving] = useState(false);
  const [playerId, setPlayerId] = useState(createPlayerId);
  // Choisi à l'ouverture : l'aperçu est le personnage final, couleur non utilisée en priorité.
  const [character, setCharacter] = useState(() => (editing ? characterOf(editing) : pickCharacter(players)));

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
    const id = editing?.id ?? playerId;
    setSaving(true);
    try {
      const photoChanged = photoUri !== (editing?.photoUri ?? null);
      const savedPhoto = photoUri && photoChanged ? await persistPlayerPhoto(photoUri, id) : photoUri ?? undefined;
      if (editing) await onUpdatePlayer({ ...editing, name: cleanName, photoUri: savedPhoto });
      else {
        await onAddPlayer({ id, name: cleanName, photoUri: savedPhoto, createdAt: new Date().toISOString(), character });
        setName(''); setPhotoUri(null); setPlayerId(createPlayerId()); setCharacter(pickCharacter([...players, { id, character }]));
      }
      onClose();
    } catch { Alert.alert('Impossible d’enregistrer ce joueur', 'La photo n’a pas pu être enregistrée.'); }
    finally { setSaving(false); }
  };

  return (
    <BottomSheet index={visible ? 0 : -1} onClose={onClose} snapPoints={editing ? ['66%', '90%'] : ['58%', '90%']} enablePanDownToClose backgroundStyle={{ backgroundColor: Colors.white }}>
      <BottomSheetView style={styles.host}>
        <View style={styles.content}>
          <View style={styles.face}>
            <Text style={styles.title}>{editing ? 'Modifier le joueur' : 'Nouveau joueur'}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Choisir une photo dans la galerie" onPress={() => choosePhoto('library')}>
              <AvatarImage uri={photoUri ?? undefined} seed={playerId} character={character} size={96} />
            </Pressable>
            <View style={styles.sources}>
              <SourceChip icon="image" label="Galerie" onPress={() => choosePhoto('library')} />
              <SourceChip icon="camera" label="Appareil photo" onPress={() => choosePhoto('camera')} />
            </View>
          </View>

          <TextInput value={name} onChangeText={setName} placeholder="Prénom" placeholderTextColor={Colors.muted} autoCapitalize="words" maxLength={40} style={styles.input} />

          <View style={styles.actions}>
            <View style={styles.action}><PillButton label="Annuler" secondary outlined onPress={close} /></View>
            <View style={styles.action}><PillButton label={saving ? 'Enregistrement…' : editing ? 'Enregistrer' : 'Ajouter'} onPress={save} disabled={saving} /></View>
          </View>

          {editing && onRemove && (
            <Pressable accessibilityRole="button" onPress={() => onRemove(editing)} hitSlop={8} style={styles.remove}>
              <Feather name="trash-2" size={16} color={Colors.muted} />
              <Text style={styles.removeText}>Retirer ce joueur</Text>
            </Pressable>
          )}
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
}

/** Source de photo : pastille à contour fin avec glyphe, cible de 44 pt. */
function SourceChip({ icon, label, onPress }: { icon: 'image' | 'camera'; label: string; onPress: () => void }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}>
      <Feather name={icon} size={17} color={Colors.ink} />
      <Text style={styles.chipText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, width: '100%' },
  // Aligné en bas : la sheet native réduit déjà sa zone au-dessus du clavier, l'input et les actions restent collés à lui.
  content: { width: '100%', flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.md, gap: Spacing.lg, justifyContent: 'flex-end' },
  face: { alignItems: 'center', gap: Spacing.sm + 2 },
  title: { color: Colors.ink, ...Type.title, textAlign: 'center' },
  sources: { flexDirection: 'row', gap: Spacing.sm },
  chip: { minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: Spacing.md, borderRadius: Radius.pill, borderWidth: 1.5, borderColor: Colors.hairline },
  chipPressed: { opacity: 0.5 },
  chipText: { color: Colors.ink, ...Type.label },
  // Pas de lineHeight sur un TextInput iOS : elle décale le texte vers le haut. Hauteur fixe + padding vertical nul = texte centré.
  input: { height: 56, borderRadius: Radius.pill, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.hairline, paddingHorizontal: Spacing.lg, paddingVertical: 0, color: Colors.ink, fontSize: Type.body.fontSize, fontWeight: Type.body.fontWeight, textAlignVertical: 'center' },
  actions: { flexDirection: 'row', gap: Spacing.sm },
  action: { flex: 1 },
  remove: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: -Spacing.sm },
  removeText: { color: Colors.muted, ...Type.label },
});
