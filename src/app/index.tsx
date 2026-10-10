import Feather from '@expo/vector-icons/Feather';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EmptyState, Mascot, PillButton } from '@/components/design';
import { AddPlayerBottomSheet } from '@/components/players/AddPlayerBottomSheet';
import { AddTile, PlayerTile, TileSpacer } from '@/components/players/PlayerTile';
import { useAppData } from '@/features/app/app-data';
import type { Player } from '@/features/players/types';
import { Colors, Spacing, Type } from '@/theme/tokens';

const MAX_PLAYERS = 10;

type Cell = { kind: 'player'; player: Player } | { kind: 'add' } | { kind: 'spacer' };

export default function HomeScreen() {
  const { ready, players, questions, disabledQuestionIds, addPlayer, updatePlayer, removePlayer } = useAppData();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const openSheet = (player: Player | null) => { setEditingPlayer(player); setSheetVisible(true); };
  const activeQuestions = questions.filter((question) => !disabledQuestionIds.includes(question.id));
  const canPlay = players.length >= 3 && activeQuestions.length > 0;
  const missing = Math.max(0, 3 - players.length);

  const confirmRemovePlayer = (player: Player) => Alert.alert(`Retirer ${player.name} ?`, player.photoUri ? 'Sa photo sera supprimée de ce téléphone.' : 'Ce joueur sera retiré de la liste.', [
    { text: 'Annuler', style: 'cancel' },
    { text: 'Retirer', style: 'destructive', onPress: () => { setSheetVisible(false); removePlayer(player.id); } },
  ]);

  const startGame = () => {
    if (players.length < 3) return Alert.alert('Encore un peu de monde', 'Il faut au moins 3 joueurs pour que le vote soit drôle.');
    if (!activeQuestions.length) return Alert.alert('Aucune question active', 'Réactive une question dans « Les questions ».');
    const question = activeQuestions[Math.floor(Math.random() * activeQuestions.length)];
    router.push({ pathname: '/game', params: { questionId: question.id } });
  };

  // Grille à 2 colonnes : joueurs, puis la tuile d'ajout, puis une place vide si le total est impair.
  const cells: Cell[] = players.map((player) => ({ kind: 'player', player }));
  if (players.length < MAX_PLAYERS) cells.push({ kind: 'add' });
  if (cells.length % 2 === 1) cells.push({ kind: 'spacer' });

  if (!ready) return <View style={styles.loading}><Text style={styles.loadingText}>On prépare la soirée…</Text></View>;
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Mascot size={52} />
        <Text style={styles.title}>Qui a dit ?</Text>
        <View style={styles.count} accessibilityLabel={`${players.length} joueurs sur ${MAX_PLAYERS}`}>
          <Feather name="users" size={16} color={Colors.ink} />
          <Text style={styles.countText}>{players.length}/{MAX_PLAYERS}</Text>
        </View>
      </View>

      {players.length === 0 ? (
        <View style={styles.empty}>
          <EmptyState title="Qui vient jouer ?" detail="Ajoute les joueurs de la soirée." action={<View style={styles.emptyAction}><PillButton label="Ajouter un joueur" onPress={() => openSheet(null)} /></View>} />
        </View>
      ) : (
        <FlatList
          data={cells}
          numColumns={2}
          keyExtractor={(cell, index) => (cell.kind === 'player' ? cell.player.id : `${cell.kind}-${index}`)}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => item.kind === 'player' ? <PlayerTile player={item.player} onPress={openSheet} /> : item.kind === 'add' ? <AddTile onPress={() => openSheet(null)} /> : <TileSpacer />}
        />
      )}

      <View style={styles.footer}>
        {missing > 0 && <Text style={styles.needMore}>Encore {missing} joueur{missing > 1 ? 's' : ''} pour pouvoir jouer.</Text>}
        <PillButton label="On joue" onPress={startGame} disabled={!canPlay} />
        <Pressable accessibilityRole="button" onPress={() => router.push('/questions')} hitSlop={8} style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}>
          <Text style={styles.linkText}>Les questions</Text>
          <Feather name="chevron-right" size={18} color={Colors.ink} />
        </Pressable>
      </View>

      <AddPlayerBottomSheet
        key={editingPlayer?.id ?? 'new'}
        players={players}
        editing={editingPlayer}
        onUpdatePlayer={updatePlayer}
        onRemove={confirmRemovePlayer}
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        onAddPlayer={addPlayer}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: Colors.ink, ...Type.body },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md, paddingBottom: Spacing.md },
  title: { color: Colors.ink, ...Type.title, flex: 1 },
  count: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 36, paddingHorizontal: Spacing.sm + 2, borderRadius: 18, backgroundColor: Colors.white },
  countText: { color: Colors.ink, ...Type.label },
  empty: { flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing.md },
  emptyAction: { alignSelf: 'stretch', marginTop: Spacing.sm },
  grid: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.lg, gap: Spacing.sm + 2 },
  row: { gap: Spacing.sm + 2 },
  footer: { gap: Spacing.sm, paddingHorizontal: Spacing.lg, paddingTop: Spacing.sm, paddingBottom: Spacing.md, backgroundColor: Colors.background },
  needMore: { color: Colors.muted, ...Type.body, textAlign: 'center' },
  link: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2 },
  linkPressed: { opacity: 0.5 },
  linkText: { color: Colors.ink, ...Type.label },
});
