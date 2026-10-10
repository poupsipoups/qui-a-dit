import type { Player } from '@/features/players/types';
import type { Question } from '@/features/questions/types';

import { createRound } from './logic';
import { createPartyState, partyReducer, type PartyAction, type PartyState } from './party-reducer';

const question: Question = { id: 'q1', text: 'Quel est ton talent le plus inutile ?', origin: 'official' };
const players: Player[] = ['a', 'b', 'c'].map((id) => ({ id, name: id, photoUri: 'file://x.jpg', createdAt: '2026-01-01T00:00:00.000Z' }));

const run = (state: PartyState, ...actions: PartyAction[]) => actions.reduce(partyReducer, state);
const newGame = () => run(createPartyState(createRound(question, players)), { type: 'start' });
const answerTurn = (state: PartyState, text: string) => run(state, { type: 'ready' }, { type: 'draft', text }, { type: 'submit' });

function votingState() {
  let state = newGame();
  for (const text of ['un', 'deux', 'trois']) state = answerTurn(state, text);
  return state;
}

describe('partyReducer', () => {
  it('commence par la question commune avant le premier passage', () => {
    const intro = createPartyState(createRound(question, players));
    expect(intro.phase).toBe('intro');
    expect(partyReducer(intro, { type: 'ready' })).toBe(intro);
    expect(partyReducer(intro, { type: 'start' }).phase).toBe('handoff');
  });

  it('passe de handoff à answer puis revient à handoff après une réponse', () => {
    const start = newGame();
    const answering = run(start, { type: 'ready' });
    expect(answering.phase).toBe('answer');
    const next = answerTurn(start, 'salut');
    expect(next.phase).toBe('handoff');
    expect(next.round.answers).toHaveLength(1);
    expect(next.draft).toBe('');
  });

  it('ignore une réponse vide', () => {
    const answering = run(newGame(), { type: 'ready' }, { type: 'draft', text: '   ' });
    expect(partyReducer(answering, { type: 'submit' })).toBe(answering);
  });

  it('passe en vote quand tout le monde a répondu', () => {
    const state = votingState();
    expect(state.phase).toBe('vote');
    expect(state.round.shuffledAnswerIds).toHaveLength(3);
  });

  it('passe en révélation après le dernier vote et sait annuler', () => {
    let state = votingState();
    const [a, b, c] = state.round.turnOrder;
    state = run(state, { type: 'vote', playerId: a }, { type: 'vote', playerId: b });
    expect(state.round.votes).toHaveLength(2);
    state = run(state, { type: 'undo' });
    expect(state.round.votes).toHaveLength(1);
    state = run(state, { type: 'vote', playerId: b }, { type: 'vote', playerId: c });
    expect(state.phase).toBe('reveal');
  });

  it('ignore le vote pour une personne déjà choisie', () => {
    const state = votingState();
    const voted = run(state, { type: 'vote', playerId: 'a' });
    expect(partyReducer(voted, { type: 'vote', playerId: 'a' })).toBe(voted);
  });

  it('parcourt les révélations puis termine', () => {
    let state = votingState();
    for (const id of state.round.turnOrder) state = run(state, { type: 'vote', playerId: id });
    state = run(state, { type: 'next' }, { type: 'next' });
    expect(state.phase).toBe('reveal');
    expect(state.revealIndex).toBe(2);
    expect(run(state, { type: 'next' }).phase).toBe('complete');
  });
});
