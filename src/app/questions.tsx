import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PillButton, SectionLabel } from '@/components/design';
import { AddQuestionBottomSheet } from '@/components/questions/AddQuestionBottomSheet';
import { QuestionCard } from '@/components/questions/QuestionCard';
import { useAppData } from '@/features/app/app-data';
import { Colors, Spacing } from '@/theme/tokens';

export default function QuestionsScreen() {
  const { questions, disabledQuestionIds, toggleQuestion, addLocalSuggestion } = useAppData();
  const [sheetVisible, setSheetVisible] = useState(false);
  const official = questions.filter((question) => question.origin === 'official'); const suggested = questions.filter((question) => question.origin === 'suggestion');
  const card = (id: string, text: string, index: number) => <QuestionCard key={id} id={id} text={text} index={index} enabled={!disabledQuestionIds.includes(id)} onToggle={() => toggleQuestion(id)} />;
  return <SafeAreaView style={styles.safeArea}><View style={styles.header}><Pressable onPress={() => router.back()} hitSlop={12}><Text style={styles.back}>‹</Text></Pressable><View><Text style={styles.eyebrow}>LA BOÎTE</Text><Text style={styles.title}>Questions</Text></View></View><FlatList data={[]} renderItem={() => null} contentContainerStyle={styles.list} ListHeaderComponent={<><SectionLabel>Dans la boîte</SectionLabel>{official.map((item, index) => card(item.id, item.text, index))}{suggested.length > 0 && <View style={styles.sectionGap}><SectionLabel>Proposées</SectionLabel>{suggested.map((item, index) => card(item.id, item.text, index + official.length))}</View>}</>} ListFooterComponent={<PillButton label="Proposer une question" secondary onPress={() => setSheetVisible(true)} />} />
    <AddQuestionBottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} onAdd={addLocalSuggestion} />
  </SafeAreaView>;
}

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: Colors.background }, header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg }, back: { color: Colors.berry, fontSize: 42, lineHeight: 42 }, eyebrow: { color: Colors.berry, fontSize: 11, fontWeight: '800', letterSpacing: 1.1 }, title: { color: Colors.ink, fontSize: 34, fontWeight: '800', letterSpacing: -0.8 }, list: { paddingHorizontal: Spacing.lg, gap: Spacing.sm, paddingBottom: Spacing.xl }, sectionGap: { gap: Spacing.sm, marginTop: Spacing.lg } });
