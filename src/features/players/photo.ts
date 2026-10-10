import * as ImagePicker from 'expo-image-picker';
import { Directory, File, Paths } from 'expo-file-system';

export type PhotoSource = 'library' | 'camera';

export async function pickPlayerPhoto(source: PhotoSource): Promise<string | null> {
  if (source === 'camera') {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) throw new Error('Autorise l’appareil photo pour prendre une photo.');
  } else {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) throw new Error('Autorise la galerie pour choisir une photo.');
  }

  const result = source === 'camera'
    ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 })
    : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });

  return result.canceled ? null : result.assets[0].uri;
}

export async function persistPlayerPhoto(sourceUri: string, playerId: string): Promise<string> {
  const directory = new Directory(Paths.document, 'players');
  if (!directory.exists) directory.create({ idempotent: true, intermediates: true });
  const source = new File(sourceUri);
  const extension = source.extension || '.jpg';
  const destination = new File(directory, `${playerId}${extension}`);
  await source.copy(destination, { overwrite: true });
  return destination.uri;
}

export function removePlayerPhoto(uri: string) {
  try {
    const file = new File(uri);
    if (file.exists) file.delete();
  } catch {
    // A removed or unavailable photo should not block player deletion.
  }
}
