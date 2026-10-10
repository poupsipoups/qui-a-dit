import type { PropsWithChildren } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Colors } from '@/theme/tokens';

export function SectionLabel({ children }: PropsWithChildren) { return <Text style={styles.label}>{children}</Text>; }

const styles = StyleSheet.create({ label: { color: Colors.berry, fontSize: 12, fontWeight: '800', letterSpacing: 1.1, textTransform: 'uppercase' } });
