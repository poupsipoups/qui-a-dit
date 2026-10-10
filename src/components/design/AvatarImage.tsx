import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { Colors } from '@/theme/tokens';

export function AvatarImage({ uri, name, size = 62, selected = false, disabled = false }: { uri?: string; name: string; size?: number; selected?: boolean; disabled?: boolean }) {
  const initials = name.trim().slice(0, 1).toUpperCase() || '?';
  return <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, selected && styles.selected, disabled && styles.disabled]}>{uri ? <Image source={{ uri } as ImageSourcePropType} resizeMode="cover" style={styles.image} /> : <Text style={styles.initials}>{initials}</Text>}</View>;
}

const styles = StyleSheet.create({
  avatar: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.lavender, borderWidth: 3, borderColor: 'transparent' },
  selected: { borderColor: Colors.berry, transform: [{ scale: 1.04 }] }, disabled: { opacity: 0.36 }, image: { width: '100%', height: '100%' }, initials: { color: Colors.berry, fontWeight: '800', fontSize: 22 },
});
