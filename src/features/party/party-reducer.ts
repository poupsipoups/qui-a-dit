import { addAnswer, assignVote, undoLastVote } from './logic';
import type { PartyPhase, Round } from './types';

export type PartyState = { round: Round; phase: PartyPhase; draft: string; revealIndex: number };

export type PartyAction =
  | { type: 'ready' }
  | { type: 'draft'; text: string }
  | { type: 'submit' }
  | { type: 'vote'; playerId: string }
  | { type: 'undo' }
  | { type: 'next' };

export function createPartyState(round: Round): PartyState {
  return { round, phase: 'handoff', draft: '', revealIndex: 0 };
}

/** Une action invalide est ignorée : l’interface empêche déjà ces cas, la logique pure reste la garde finale. */
export function partyReducer(state: PartyState, action: PartyAction): PartyState {
  const { round } = state;
  switch (action.type) {
    case 'ready':
      return state.phase === 'handoff' ? { ...state, phase: 'answer' } : state;
    case 'draft':
      return state.phase === 'answer' ? { ...state, draft: action.text } : state;
    case 'submit': {
      const authorId = round.turnOrder[round.answers.length];
      if (state.phase !== 'answer' || !authorId) return state;
      try {
        const next = addAnswer(round, authorId, state.draft);
        return { ...state, round: next, draft: '', phase: next.shuffledAnswerIds ? 'vote' : 'handoff' };
      } catch {
        return state;
      }
    }
    case 'vote': {
      const answerId = round.shuffledAnswerIds?.[round.votes.length];
      if (state.phase !== 'vote' || !answerId) return state;
      try {
        const next = assignVote(round, answerId, action.playerId);
        const done = next.votes.length === next.answers.length;
        return { ...state, round: next, phase: done ? 'reveal' : 'vote', revealIndex: 0 };
      } catch {
        return state;
      }
    }
    case 'undo':
      return state.phase === 'vote' ? { ...state, round: undoLastVote(round) } : state;
    case 'next': {
      if (state.phase !== 'reveal') return state;
      const last = state.revealIndex + 1 >= round.answers.length;
      return last ? { ...state, phase: 'complete' } : { ...state, revealIndex: state.revealIndex + 1 };
    }
  }
}
