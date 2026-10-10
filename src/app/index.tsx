import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState, Mascot, PillButton, SectionLabel } from '@/components/design';
import { AddPlayerBottomSheet } from '@/components/players/AddPlayerBottomSheet';
import { PlayerCard } from '@/components/players/PlayerCard';
import { useAppData } from '@/features/app/app-data';
import type { Player } from '@/features/players/types';
import { Colors, Spacing } from '@/theme/tokens';

export default function HomeScreen() {
  const { ready, players, questions, disabledQuestionIds, addPlayer, removePlayer } = useAppData();
  const [sheetVisible, setSheetVisible] = useState(false);
  const activeQuestions = questions.filter((question) => !disabledQuestionIds.includes(question.id));
  const canPlay = players.length >= 3 && activeQuestions.length > 0;

  const confirmRemovePlayer = (player: Player) => Alert.alert(`Retirer ${player.name} ?`, 'Sa photo sera supprimée de ce téléphone.', [{ text: 'Annuler', style: 'cancel' }, { text: 'Retirer', style: 'destructive', onPress: () => removePlayer(player.id) }]);

  const startGame = () => {
    if (players.length < 3) return Alert.alert('Encore un peu de monde', 'Il faut au moins 3 joueurs pour que le vote soit drôle.');
    if (!activeQuestions.length) return Alert.alert('Aucune question active', 'Réactive une question dans « Les questions ».');
    const question = activeQuestions[Math.floor(Math.random() * activeQuestions.length)];
    router.push({ pathname: '/game', params: { questionId: question.id } });
  };

  if (!ready) return <View style={styles.loading}><Text style={styles.loadingText}>On prépare la soirée…</Text></View>;
  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}><Mascot size={56} /><View><Text style={styles.eyebrow}>PARTY GAME</Text><Text style={styles.title}>Qui a dit ?</Text></View></View>
    <View style={styles.content}>
      <SectionLabel>Les joueurs · {players.length}/10</SectionLabel>
      {players.length === 0 ? <EmptyState title="Qui vient jouer ?" detail="Ajoute au moins trois personnes avec leur photo." action={<View style={styles.emptyAction}><PillButton label="Ajouter un joueur" onPress={() => setSheetVisible(true)} /></View>} /> : <FlatList data={players} keyExtractor={(item) => item.id} contentContainerStyle={styles.playerList} renderItem={({ item, index }) => <PlayerCard player={item} index={index} onRemove={confirmRemovePlayer} />} ListFooterComponent={players.length < 10 ? <Pressable onPress={() => setSheetVisible(true)} style={styles.addCard}><Text style={styles.addText}>+ Ajouter un joueur</Text></Pressable> : null} />}
    </View>
    <View style={styles.footer}><PillButton label="Les questions" secondary onPress={() => router.push('/questions')} /><PillButton label="On joue" onPress={startGame} disabled={!canPlay} /></View>
    <AddPlayerBottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)} onOpen={() => setSheetVisible(true)} onAddPlayer={addPlayer} />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background }, loading: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }, loadingText: { color: Colors.berry, fontSize: 16, fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg }, eyebrow: { color: Colors.berry, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 }, title: { color: Colors.ink, fontSize: 34, fontWeight: '800', letterSpacing: -0.8 }, content: { flex: 1, paddingHorizontal: Spacing.lg, gap: Spacing.md }, playerList: { gap: Spacing.sm, paddingBottom: Spacing.xl },
  addCard: { minHeight: 64, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(99,58,90,0.18)', borderStyle: 'dashed' }, addText: { color: Colors.berry, fontSize: 16, fontWeight: '700' }, emptyAction: { alignSelf: 'stretch', marginTop: Spacing.sm }, footer: { flexDirection: 'row', gap: Spacing.sm, padding: Spacing.lg, backgroundColor: 'rgba(246,200,213,0.92)' },
});
