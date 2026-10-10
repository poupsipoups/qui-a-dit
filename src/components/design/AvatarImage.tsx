import { Image, StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';

import { playerInitials } from '@/features/players/initials';
import { Colors } from '@/theme/tokens';

const fills = [Colors.anis, Colors.sky, Colors.orange, Colors.white] as const;
const fillFor = (name: string) => fills[Array.from(name).reduce((sum, char) => sum + char.codePointAt(0)!, 0) % fills.length];

export function AvatarImage({ uri, name, size = 62, selected = false, disabled = false }: { uri?: string; name: string; size?: number; selected?: boolean; disabled?: boolean }) {
  const initials = playerInitials(name);
  return <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2, backgroundColor: fillFor(name) }, selected && styles.selected, disabled && styles.disabled]}>{uri ? <Image source={{ uri } as ImageSourcePropType} resizeMode="cover" style={styles.image} /> : <Text style={[styles.initials, { fontSize: size * 0.38 }]}>{initials}</Text>}</View>;
}

const styles = StyleSheet.create({
  avatar: { overflow: 'hidden', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: 'transparent' },
  selected: { borderColor: Colors.ink, transform: [{ scale: 1.04 }] }, disabled: { opacity: 0.45 }, image: { width: '100%', height: '100%' }, initials: { color: Colors.ink, fontWeight: '800' },
});
