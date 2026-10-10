import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { Alert, BackHandler, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnswerPhase } from '@/components/game/AnswerPhase';
import { CenteredMessage } from '@/components/game/CenteredMessage';
import { GameTopbar } from '@/components/game/GameTopbar';
import { HandoffPhase } from '@/components/game/HandoffPhase';
import { RevealPhase } from '@/components/game/RevealPhase';
import { VotePhase } from '@/components/game/VotePhase';
import { useAppData } from '@/features/app/app-data';
import { answerForId, availablePlayerIds, createRound, voteForAnswer } from '@/features/party/logic';
import { createPartyState, partyReducer } from '@/features/party/party-reducer';
import type { Round } from '@/features/party/types';
import { Colors } from '@/theme/tokens';

const goHome = () => router.replace('/');

export default function GameScreen() {
  const { questionId } = useLocalSearchParams<{ questionId: string }>();
  const { players, questions } = useAppData();
  // La manche est créée une seule fois : un rafraîchissement du catalogue ne doit pas l’interrompre.
  const [round] = useState(() => {
    const question = questions.find((item) => item.id === questionId);
    return question && players.length >= 3 ? createRound(question, players) : null;
  });

  if (!round) {
    return <Frame><CenteredMessage title="Cette partie n’est plus disponible." actionLabel="Retour à l’accueil" onAction={goHome} /></Frame>;
  }
  return <Party round={round} />;
}

function Party({ round: initialRound }: { round: Round }) {
  const { players } = useAppData();
  const [state, dispatch] = useReducer(partyReducer, initialRound, createPartyState);
  const playerById = useMemo(() => new Map(players.map((player) => [player.id, player])), [players]);
  const inProgress = state.phase !== 'complete';

  const leave = useCallback(() => {
    Alert.alert('Quitter la partie ?', 'Les réponses de cette partie seront oubliées.', [
      { text: 'Continuer', style: 'cancel' },
      { text: 'Quitter', style: 'destructive', onPress: goHome },
    ]);
  }, []);

  // Android : le bouton retour demande confirmation au lieu de quitter la partie en cours.
  useEffect(() => {
    if (!inProgress) return;
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => { leave(); return true; });
    return () => subscription.remove();
  }, [inProgress, leave]);

  const { round, phase, draft, revealIndex } = state;
  const total = round.turnOrder.length;
  const turnIndex = round.answers.length;
  const currentPlayer = playerById.get(round.turnOrder[turnIndex]);
  const remaining = availablePlayerIds(round);
  const votingAnswerId = round.shuffledAnswerIds?.[round.votes.length];
  const votingAnswer = votingAnswerId ? answerForId(round, votingAnswerId) : undefined;
  const revealAnswerId = round.shuffledAnswerIds?.[revealIndex];
  const revealAnswer = revealAnswerId ? answerForId(round, revealAnswerId) : undefined;

  if (phase === 'handoff' && currentPlayer) {
    return (
      <Frame>
        <GameTopbar label={`Réponse ${turnIndex + 1}/${total}`} onLeave={leave} />
        <HandoffPhase player={currentPlayer} tone={turnIndex % 2 ? 'yellow' : 'mint'} onReady={() => dispatch({ type: 'ready' })} />
      </Frame>
    );
  }

  if (phase === 'answer') {
    return (
      <Frame>
        <GameTopbar label={`À toi, ${currentPlayer?.name ?? ''}`} onLeave={leave} />
        <AnswerPhase
          question={round.question.text}
          draft={draft}
          onChange={(text) => dispatch({ type: 'draft', text })}
          onSubmit={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); dispatch({ type: 'submit' }); }}
        />
      </Frame>
    );
  }

  if (phase === 'vote' && votingAnswer) {
    return (
      <Frame>
        <GameTopbar label={`Qui a dit · ${round.votes.length + 1}/${total}`} onLeave={leave} />
        <VotePhase
          answer={votingAnswer.text}
          players={players.filter((player) => round.turnOrder.includes(player.id))}
          availableIds={remaining}
          onVote={(playerId) => { void Haptics.selectionAsync(); dispatch({ type: 'vote', playerId }); }}
          onUndo={round.votes.length > 0 ? () => dispatch({ type: 'undo' }) : undefined}
        />
      </Frame>
    );
  }

  if (phase === 'reveal' && revealAnswer) {
    const isLast = revealIndex + 1 >= total;
    const guessedId = voteForAnswer(round, revealAnswer.id)?.guessedPlayerId;
    return (
      <Frame>
        <GameTopbar label={`Révélation ${revealIndex + 1}/${total}`} />
        <RevealPhase
          answer={revealAnswer.text}
          guessed={guessedId ? playerById.get(guessedId) : undefined}
          author={playerById.get(revealAnswer.authorId)}
          isLast={isLast}
          onNext={() => {
            void (isLast ? Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success) : Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
            dispatch({ type: 'next' });
          }}
        />
      </Frame>
    );
  }

  return (
    <Frame>
      <CenteredMessage title="C’est fini !" detail="Vous connaissez maintenant tous les petits secrets de la table." actionLabel="Nouvelle partie" onAction={goHome} />
    </Frame>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: Colors.background } });
