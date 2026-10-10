import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Spacing } from '@/theme/tokens';
export function GameTopbar({ label, onLeave }: { label: string; onLeave?: () => void }) { return <View style={styles.bar}><Text style={styles.label}>{label}</Text>{onLeave && <Pressable onPress={onLeave}><Text style={styles.quit}>Quitter</Text></Pressable>}</View>; }
const styles = StyleSheet.create({ bar: { minHeight: 56, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, label: { color: Colors.berry, fontWeight: '800' }, quit: { color: Colors.berry, fontWeight: '700' } });
