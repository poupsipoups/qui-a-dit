import type { PropsWithChildren } from 'react';
import { StyleSheet, Text } from 'react-native';

import { Colors, Type } from '@/theme/tokens';

export function SectionLabel({ children }: PropsWithChildren) { return <Text style={styles.label}>{children}</Text>; }

const styles = StyleSheet.create({ label: { color: Colors.ink, ...Type.label } });
