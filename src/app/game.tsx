import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, BackHandler, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CandyCard, Face, PillButton } from '@/components/ui';
import { useAppData } from '@/features/app/app-data';
import { addAnswer, answerForId, assignVote, availablePlayerIds, createRound, undoLastVote, voteForAnswer } from '@/features/party/logic';
import type { PartyPhase, Round } from '@/features/party/types';
import { Colors, Spacing } from '@/theme/tokens';

export default function GameScreen() {
  const { questionId } = useLocalSearchParams<{ questionId: string }>();
  const { players, questions } = useAppData();
  const question = questions.find((item) => item.id === questionId);
  const [round, setRound] = useState<Round | null>(() => question && players.length >= 3 ? createRound(question, players) : null);
  const [phase, setPhase] = useState<PartyPhase>('handoff');
  const [draft, setDraft] = useState('');
  const [revealIndex, setRevealIndex] = useState(0);

  const playerById = useMemo(() => new Map(players.map((player) => [player.id, player])), [players]);
  const leave = useCallback(() => {
    Alert.alert('Quitter la partie ?', 'Les réponses de cette partie seront oubliées.', [{ text: 'Continuer', style: 'cancel' }, { text: 'Quitter', style: 'destructive', onPress: () => router.replace('/') }]);
  }, []);
  const hasRound = round !== null && phase !== 'complete';

  // Android : le bouton retour demande confirmation au lieu de quitter la partie en cours.
  useEffect(() => {
    if (!hasRound) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => { leave(); return true; });
    return () => subscription.remove();
  }, [hasRound, leave]);

  // La manche garde sa propre question : un rafraîchissement du catalogue ne doit pas interrompre la partie.
  if (!round) return <SafeAreaView style={styles.safeArea}><View style={styles.center}><Text style={styles.title}>Cette partie n’est plus disponible.</Text><PillButton label="Retour à l’accueil" onPress={() => router.replace('/')} /></View></SafeAreaView>;

  const totalPlayers = round.turnOrder.length;
  const turnIndex = round.answers.length;
  const currentPlayer = playerById.get(round.turnOrder[turnIndex]);
  const votingAnswerId = round.shuffledAnswerIds?.[round.votes.length];
  const votingAnswer = votingAnswerId ? answerForId(round, votingAnswerId) : undefined;
  const remaining = availablePlayerIds(round);
  const revealAnswerId = round.shuffledAnswerIds?.[revealIndex];
  const revealAnswer = revealAnswerId ? answerForId(round, revealAnswerId) : undefined;

  const submit = () => {
    if (!currentPlayer) return;
    try {
      const next = addAnswer(round, currentPlayer.id, draft);
      setRound(next); setDraft('');
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setPhase(next.shuffledAnswerIds ? 'vote' : 'handoff');
    } catch (error) { Alert.alert('Réponse invalide', error instanceof Error ? error.message : 'Réessaie.'); }
  };
  const vote = (playerId: string) => {
    if (!votingAnswer) return;
    try {
      const next = assignVote(round, votingAnswer.id, playerId); setRound(next); void Haptics.selectionAsync();
      if (next.votes.length === next.answers.length) { setPhase('reveal'); setRevealIndex(0); }
    } catch (error) { Alert.alert('Vote impossible', error instanceof Error ? error.message : 'Réessaie.'); }
  };
  const useForcedVote = () => { if (remaining[0]) vote(remaining[0]); };
  const nextReveal = () => { if (revealIndex + 1 >= round.answers.length) { setPhase('complete'); void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } else { setRevealIndex((index) => index + 1); void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } };

  if (phase === 'handoff' && currentPlayer) return <SafeAreaView style={styles.safeArea}><View style={styles.topbar}><Text style={styles.progress}>Réponse {turnIndex + 1}/{totalPlayers}</Text><Pressable onPress={leave}><Text style={styles.quit}>Quitter</Text></Pressable></View><View style={styles.center}><Text style={styles.handoffLabel}>Passe le téléphone à</Text><CandyCard tone={turnIndex % 2 ? 'yellow' : 'mint'} style={styles.handoffCard}><Face uri={currentPlayer.photoUri} name={currentPlayer.name} size={164} /><Text style={styles.handoffName}>{currentPlayer.name}</Text></CandyCard><Text style={styles.handoffHint}>Personne ne regarde la suite 🙈</Text><PillButton label="C’est moi" onPress={() => setPhase('answer')} /></View></SafeAreaView>;

  if (phase === 'answer') return <SafeAreaView style={styles.safeArea}><View style={styles.topbar}><Text style={styles.progress}>À toi, {currentPlayer?.name}</Text><Pressable onPress={leave}><Text style={styles.quit}>Quitter</Text></Pressable></View><View style={styles.answerScreen}><Text style={styles.answerEyebrow}>RÉPONDS SANS TE FAIRE GRILLER</Text><CandyCard style={styles.questionCard}><Text style={styles.question}>{round.question.text}</Text></CandyCard><TextInput value={draft} onChangeText={setDraft} placeholder="Ta réponse…" placeholderTextColor={Colors.muted} multiline autoFocus maxLength={280} style={styles.answerInput} /><Text style={styles.charCount}>{draft.length}/280</Text><PillButton label="Valider et passer le téléphone" onPress={submit} /></View></SafeAreaView>;

  if (phase === 'vote' && votingAnswer) return <SafeAreaView style={styles.safeArea}><View style={styles.topbar}><Text style={styles.progress}>Qui a dit · {round.votes.length + 1}/{totalPlayers}</Text><Pressable onPress={leave}><Text style={styles.quit}>Quitter</Text></Pressable></View><ScrollView contentContainerStyle={styles.voteScreen}><Text style={styles.voteTitle}>Qui a dit…</Text><CandyCard tone="white" style={styles.voteAnswerCard}><Text style={styles.voteAnswer}>“{votingAnswer.text}”</Text></CandyCard>{remaining.length === 1 ? <CandyCard tone="lavender" style={styles.forcedCard}><Text style={styles.forcedLabel}>Il ne reste que</Text><Text style={styles.forcedName}>{playerById.get(remaining[0])?.name}</Text><PillButton label="Valider ce dernier choix" onPress={useForcedVote} /></CandyCard> : <View style={styles.faceGrid}>{players.map((player) => { const available = remaining.includes(player.id); return <Pressable key={player.id} disabled={!available} onPress={() => vote(player.id)} style={styles.faceChoice}><Face uri={player.photoUri} name={player.name} size={88} disabled={!available} /><Text style={[styles.faceName, !available && styles.faceNameDisabled]}>{player.name}</Text></Pressable>; })}</View>}{round.votes.length > 0 && <PillButton label="Modifier le vote précédent" secondary onPress={() => setRound(undoLastVote(round))} />}</ScrollView></SafeAreaView>;

  if (phase === 'reveal' && revealAnswer) {
    const voteResult = voteForAnswer(round, revealAnswer.id);
    const guessed = voteResult ? playerById.get(voteResult.guessedPlayerId) : undefined;
    const author = playerById.get(revealAnswer.authorId);
    const correct = guessed?.id === author?.id;
    return <SafeAreaView style={styles.safeArea}><View style={styles.topbar}><Text style={styles.progress}>Révélation {revealIndex + 1}/{totalPlayers}</Text></View><View style={styles.revealScreen}><Text style={styles.voteTitle}>La vérité…</Text><CandyCard tone="white" style={styles.voteAnswerCard}><Text style={styles.voteAnswer}>“{revealAnswer.text}”</Text></CandyCard><CandyCard tone={correct ? 'mint' : 'yellow'} style={styles.resultCard}><Text style={styles.resultLabel}>Vous aviez choisi</Text><Text style={styles.resultName}>{guessed?.name ?? 'personne'}</Text><Text style={styles.resultLabel}>En réalité, c’était</Text><View style={styles.authorLine}>{author && <Face uri={author.photoUri} name={author.name} size={52} />}<Text style={styles.authorName}>{author?.name}</Text></View><Text style={styles.resultMark}>{correct ? 'Bien vu !' : 'Pas du tout !'}</Text></CandyCard><PillButton label={revealIndex + 1 === totalPlayers ? 'Voir la fin' : 'Révélation suivante'} onPress={nextReveal} /></View></SafeAreaView>;
  }

  return <SafeAreaView style={styles.safeArea}><View style={styles.center}><Text style={styles.title}>C’est fini !</Text><Text style={styles.finishDetail}>Vous connaissez maintenant tous les petits secrets de la table.</Text><PillButton label="Nouvelle partie" onPress={() => router.replace('/')} /></View></SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.background }, topbar: { minHeight: 56, paddingHorizontal: Spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, progress: { color: Colors.berry, fontWeight: '800' }, quit: { color: Colors.berry, fontWeight: '700' }, center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, gap: Spacing.lg }, title: { color: Colors.ink, fontSize: 31, fontWeight: '800', textAlign: 'center' },
  handoffLabel: { color: Colors.berry, fontSize: 17, fontWeight: '700' }, handoffCard: { alignItems: 'center', gap: Spacing.md, padding: Spacing.xl, alignSelf: 'stretch' }, handoffName: { color: Colors.ink, fontSize: 34, fontWeight: '800' }, handoffHint: { color: Colors.muted, textAlign: 'center' },
  answerScreen: { flex: 1, padding: Spacing.lg, gap: Spacing.md }, answerEyebrow: { color: Colors.berry, fontWeight: '800', fontSize: 11, letterSpacing: 1.2 }, questionCard: { padding: Spacing.lg }, question: { color: Colors.ink, fontSize: 27, fontWeight: '700', lineHeight: 35 }, answerInput: { flex: 1, minHeight: 150, padding: Spacing.md, borderRadius: 24, backgroundColor: Colors.white, color: Colors.ink, fontSize: 20, textAlignVertical: 'top' }, charCount: { color: Colors.muted, alignSelf: 'flex-end', marginTop: -Spacing.sm },
  voteScreen: { padding: Spacing.lg, gap: Spacing.lg }, voteTitle: { color: Colors.ink, fontSize: 34, fontWeight: '800', textAlign: 'center' }, voteAnswerCard: { padding: Spacing.lg }, voteAnswer: { color: Colors.ink, fontSize: 23, fontWeight: '700', lineHeight: 31, textAlign: 'center' }, faceGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around', gap: Spacing.lg }, faceChoice: { width: '27%', alignItems: 'center', gap: Spacing.xs }, faceName: { color: Colors.ink, fontSize: 14, fontWeight: '700', textAlign: 'center' }, faceNameDisabled: { color: Colors.muted }, forcedCard: { alignItems: 'center', gap: Spacing.sm }, forcedLabel: { color: Colors.muted, fontWeight: '700' }, forcedName: { color: Colors.ink, fontSize: 29, fontWeight: '800' },
  revealScreen: { flex: 1, padding: Spacing.lg, gap: Spacing.lg, justifyContent: 'center' }, resultCard: { alignItems: 'center', gap: Spacing.xs }, resultLabel: { color: Colors.muted, fontSize: 14, fontWeight: '700' }, resultName: { color: Colors.ink, fontSize: 22, fontWeight: '800' }, authorLine: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginTop: Spacing.sm }, authorName: { color: Colors.ink, fontSize: 30, fontWeight: '800' }, resultMark: { color: Colors.berry, marginTop: Spacing.sm, fontSize: 17, fontWeight: '800' }, finishDetail: { color: Colors.muted, fontSize: 17, textAlign: 'center', lineHeight: 24 },
});
