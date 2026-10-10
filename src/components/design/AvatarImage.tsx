import { Image, StyleSheet, View, type ImageSourcePropType } from 'react-native';

import { Colors } from '@/theme/tokens';

import { PlayerCharacter } from './PlayerCharacter';

/** Photo du joueur ; sans photo, un petit personnage stable tiré de `seed` (l'id du joueur). */
export function AvatarImage({ uri, seed, size = 62, selected = false, disabled = false }: { uri?: string; seed: string; size?: number; selected?: boolean; disabled?: boolean }) {
  return <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, selected && styles.selected, disabled && styles.disabled]}>{uri ? <Image source={{ uri } as ImageSourcePropType} resizeMode="cover" style={styles.image} /> : <PlayerCharacter seed={seed} />}</View>;
}

const styles = StyleSheet.create({
  avatar: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'transparent' },
  selected: { borderColor: Colors.ink, transform: [{ scale: 1.04 }] }, disabled: { opacity: 0.45 }, image: { width: '100%', height: '100%' },
});
