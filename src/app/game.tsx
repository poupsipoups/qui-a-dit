import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useReducer, useState, type ReactNode } from 'react';
import { Alert, BackHandler, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnswerPhase } from '@/components/game/AnswerPhase';
import { CenteredMessage } from '@/components/game/CenteredMessage';
import { GameTopbar } from '@/components/game/GameTopbar';
import { EndPhase } from '@/components/game/EndPhase';
import { HandoffPhase } from '@/components/game/HandoffPhase';
import { IntroPhase } from '@/components/game/IntroPhase';
import { RevealPhase } from '@/components/game/RevealPhase';
import { VotePhase } from '@/components/game/VotePhase';
import { useAppData } from '@/features/app/app-data';
import { answerForId, availablePlayerIds, createRound, voteForAnswer } from '@/features/party/logic';
import { createPartyState, partyReducer } from '@/features/party/party-reducer';
import type { Player } from '@/features/players/types';
import type { Round } from '@/features/party/types';
import { Colors } from '@/theme/tokens';

const goHome = () => router.replace('/');

export default function GameScreen() {
  const { questionId } = useLocalSearchParams<{ questionId: string }>();
  // La clé repart d’une manche neuve quand on rejoue avec une autre question.
  return <Game key={questionId} questionId={questionId} />;
}

function Game({ questionId }: { questionId: string }) {
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
  const { players, questions, disabledQuestionIds } = useAppData();
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

  // Rejouer : mêmes joueurs, nouvelle question active (différente si possible).
  const replay = () => {
    const active = questions.filter((item) => !disabledQuestionIds.includes(item.id));
    const others = active.filter((item) => item.id !== initialRound.question.id);
    const pool = others.length ? others : active;
    const next = pool[Math.floor(Math.random() * pool.length)];
    if (next) router.replace({ pathname: '/game', params: { questionId: next.id } });
  };

  const { round, phase, draft, revealIndex } = state;
  const total = round.turnOrder.length;
  const turnIndex = round.answers.length;
  const currentPlayer = playerById.get(round.turnOrder[turnIndex]);
  const remaining = availablePlayerIds(round);
  const votingAnswerId = round.shuffledAnswerIds?.[round.votes.length];
  const votingAnswer = votingAnswerId ? answerForId(round, votingAnswerId) : undefined;
  const revealAnswerId = round.shuffledAnswerIds?.[revealIndex];
  const revealAnswer = revealAnswerId ? answerForId(round, revealAnswerId) : undefined;

  if (phase === 'intro') {
    return (
      <Frame>
        <GameTopbar label="La question" onLeave={leave} />
        <IntroPhase question={round.question.text} onStart={() => dispatch({ type: 'start' })} />
      </Frame>
    );
  }

  if (phase === 'handoff' && currentPlayer) {
    return (
      <Frame>
        <GameTopbar label={`${turnIndex} sur ${total} ont répondu`} onLeave={leave} />
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
          key={revealAnswer.id}
          answer={revealAnswer.text}
          guessed={guessedId ? playerById.get(guessedId) : undefined}
          author={playerById.get(revealAnswer.authorId)}
          isLast={isLast}
          onNext={() => {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            dispatch({ type: 'next' });
          }}
        />
      </Frame>
    );
  }

  return (
    <Frame>
      <EndPhase
        players={round.turnOrder.map((id) => playerById.get(id)).filter((player): player is Player => !!player)}
        found={round.votes.filter((vote) => answerForId(round, vote.answerId)?.authorId === vote.guessedPlayerId).length}
        total={total}
        onReplay={replay}
        onHome={goHome}
      />
    </Frame>
  );
}

function Frame({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>;
}

const styles = StyleSheet.create({ safeArea: { flex: 1, backgroundColor: Colors.background } });
