import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState, Mascot, PillButton, SectionLabel } from '@/components/design';
import { AddPlayerBottomSheet } from '@/components/players/AddPlayerBottomSheet';
import { PlayerCard } from '@/components/players/PlayerCard';
import { useAppData } from '@/features/app/app-data';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

export default function HomeScreen() {
  const { ready, players, questions, disabledQuestionIds, addPlayer, updatePlayer, removePlayer } = useAppData();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const openSheet = (player: Player | null) => { setEditingPlayer(player); setSheetVisible(true); };
  const activeQuestions = questions.filter((question) => !disabledQuestionIds.includes(question.id));
  const canPlay = players.length >= 3 && activeQuestions.length > 0;
  const missing = Math.max(0, 3 - players.length);

  const confirmRemovePlayer = (player: Player) => Alert.alert(`Retirer ${player.name} ?`, player.photoUri ? 'Sa photo sera supprimée de ce téléphone.' : 'Ce joueur sera retiré de la liste.', [{ text: 'Annuler', style: 'cancel' }, { text: 'Retirer', style: 'destructive', onPress: () => removePlayer(player.id) }]);

  const startGame = () => {
    if (players.length < 3) return Alert.alert('Encore un peu de monde', 'Il faut au moins 3 joueurs pour que le vote soit drôle.');
    if (!activeQuestions.length) return Alert.alert('Aucune question active', 'Réactive une question dans « Les questions ».');
    const question = activeQuestions[Math.floor(Math.random() * activeQuestions.length)];
    router.push({ pathname: '/game', params: { questionId: question.id } });
  };

  if (!ready) return <View style={styles.loading}><Text style={styles.loadingText}>On prépare la soirée…</Text></View>;
  return <SafeAreaView style={styles.safeArea}>
    <View style={styles.header}><Mascot size={56} /><Text style={styles.title}>Qui a dit ?</Text></View>
    <View style={styles.content}>
      <SectionLabel>Les joueurs · {players.length}/10</SectionLabel>
      {players.length === 0 ? <EmptyState title="Qui vient jouer ?" detail="Ajoute au moins trois personnes. La photo est facultative : sans elle, ce sont leurs initiales." action={<View style={styles.emptyAction}><PillButton label="Ajouter un joueur" onPress={() => openSheet(null)} /></View>} /> : <FlatList data={players} keyExtractor={(item) => item.id} contentContainerStyle={styles.playerList} renderItem={({ item, index }) => <PlayerCard player={item} index={index} onEdit={openSheet} onRemove={confirmRemovePlayer} />} ListFooterComponent={players.length < 10 ? <Pressable accessibilityRole="button" onPress={() => openSheet(null)} style={styles.addCard}><Text style={styles.addText}>+ Ajouter un joueur</Text></Pressable> : null} />}
    </View>
    <View style={styles.footer}>{missing > 0 && <Text style={styles.needMore}>Encore {missing} joueur{missing > 1 ? 's' : ''} pour pouvoir jouer.</Text>}<PillButton label="On joue" onPress={startGame} disabled={!canPlay} /><PillButton label="Les questions" secondary onPress={() => router.push('/questions')} /></View>
    <AddPlayerBottomSheet key={editingPlayer?.id ?? 'new'} editing={editingPlayer} onUpdatePlayer={updatePlayer} visible={sheetVisible} onClose={() => setSheetVisible(false)} onOpen={() => setSheetVisible(true)} onAddPlayer={addPlayer} />
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background }, loading: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }, loadingText: { color: Colors.ink, ...Type.body },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.lg }, title: { color: Colors.ink, ...Type.title }, content: { flex: 1, paddingHorizontal: Spacing.lg, gap: Spacing.md }, playerList: { gap: Spacing.sm, paddingBottom: Spacing.xl },
  addCard: { minHeight: 64, borderRadius: 24, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.hairline, borderStyle: 'dashed' }, addText: { color: Colors.ink, ...Type.label }, emptyAction: { alignSelf: 'stretch', marginTop: Spacing.sm }, footer: { gap: Spacing.sm, padding: Spacing.lg, backgroundColor: Colors.background }, needMore: { color: Colors.muted, ...Type.body, textAlign: 'center' },
});
