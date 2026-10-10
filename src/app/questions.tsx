import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useState } from 'react';
import { LayoutAnimation, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PillButton } from '@/components/design';
import { AddQuestionBottomSheet } from '@/components/questions/AddQuestionBottomSheet';
import { QuestionRow } from '@/components/questions/QuestionRow';
import { useAppData } from '@/features/app/app-data';
import type { Question } from '@/features/questions/types';
import { Colors, Radius, Spacing, Type } from '@/theme/tokens';

export default function QuestionsScreen() {
  const { questions, disabledQuestionIds, toggleQuestion, addLocalSuggestion } = useAppData();
  const [sheetVisible, setSheetVisible] = useState(false);

  const official = questions.filter((question) => question.origin === 'official');
  const suggested = questions.filter((question) => question.origin === 'suggestion');
  const activeCount = questions.filter((question) => !disabledQuestionIds.includes(question.id)).length;

  const toggle = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    toggleQuestion(id);
  };

  // Les questions désactivées passent en bas de leur groupe ; l'ordre d'origine est conservé de chaque côté.
  const activeFirst = (items: Question[]) => [...items.filter((item) => !disabledQuestionIds.includes(item.id)), ...items.filter((item) => disabledQuestionIds.includes(item.id))];

  const group = (title: string, source: Question[]) => {
    const items = activeFirst(source);
    return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{title} · {items.length}</Text>
      <View style={styles.group}>
        {items.map((item, index) => (
          <QuestionRow key={item.id} text={item.text} enabled={!disabledQuestionIds.includes(item.id)} onToggle={() => toggle(item.id)} last={index === items.length - 1} />
        ))}
      </View>
    </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Retour" onPress={() => router.back()} hitSlop={8} style={({ pressed }) => [styles.back, pressed && styles.backPressed]}>
          <Feather name="chevron-left" size={26} color={Colors.ink} />
        </Pressable>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Les questions</Text>
          <Text style={[styles.status, activeCount === 0 && styles.statusWarn]}>
            {activeCount === 0 ? 'Aucune active : la partie ne peut pas démarrer.' : `${activeCount} active${activeCount > 1 ? 's' : ''} sur ${questions.length}`}
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {group('Dans la boîte', official)}
        {suggested.length > 0 && group('Proposées', suggested)}
      </ScrollView>

      <View style={styles.footer}>
        <PillButton label="Proposer une question" onPress={() => setSheetVisible(true)} />
      </View>

      <AddQuestionBottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} onAdd={addLocalSuggestion} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm + 2, paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md },
  back: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.blush, alignItems: 'center', justifyContent: 'center' },
  backPressed: { opacity: 0.6 },
  titleBlock: { flex: 1 },
  title: { color: Colors.ink, ...Type.title },
  status: { color: Colors.muted, ...Type.caption },
  statusWarn: { color: Colors.ink, fontFamily: Type.label.fontFamily },
  list: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.lg, gap: Spacing.lg },
  section: { gap: Spacing.sm },
  sectionLabel: { color: Colors.ink, ...Type.caps, fontSize: 12, paddingHorizontal: Spacing.xs },
  group: { backgroundColor: Colors.blush, borderRadius: Radius.card, overflow: 'hidden' },
  footer: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md, backgroundColor: Colors.background },
});
