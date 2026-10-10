import { StyleSheet, Text, View } from 'react-native';

import { PillButton } from '@/components/design';
import { Colors, Spacing } from '@/theme/tokens';

type Props = { title: string; detail?: string; actionLabel: string; onAction: () => void };

export function CenteredMessage({ title, detail, actionLabel, onAction }: Props) {
  return (
    <View style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      {detail && <Text style={styles.detail}>{detail}</Text>}
      <PillButton label={actionLabel} onPress={onAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.lg },
  title: { color: Colors.ink, fontSize: 31, fontWeight: '800', textAlign: 'center' },
  detail: { color: Colors.muted, fontSize: 17, textAlign: 'center', lineHeight: 24 },
});
