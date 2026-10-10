import type { Player } from '@/features/players/types';
import type { Question } from '@/features/questions/types';

import { addAnswer, assignVote, availablePlayerIds, createRound, shuffle, undoLastVote } from './logic';

const question: Question = { id: 'q1', text: 'Quel est ton talent le plus inutile ?', origin: 'official' };
const players: Player[] = ['a', 'b', 'c'].map((id) => ({ id, name: id.toUpperCase(), photoUri: `file://${id}.jpg`, createdAt: '2026-01-01T00:00:00.000Z' }));

function fullRound() {
  let round = createRound(question, players);
  for (const id of round.turnOrder) round = addAnswer(round, id, `réponse de ${id}`);
  return round;
}

describe('shuffle', () => {
  it('garde les mêmes éléments sans modifier la liste d’origine', () => {
    const input = [1, 2, 3, 4, 5];
    const output = shuffle(input);
    expect(input).toEqual([1, 2, 3, 4, 5]);
    expect([...output].sort()).toEqual(input);
  });
});

describe('createRound', () => {
  it('ordonne tous les joueurs et démarre sans réponse ni vote', () => {
    const round = createRound(question, players);
    expect([...round.turnOrder].sort()).toEqual(['a', 'b', 'c']);
    expect(round.answers).toEqual([]);
    expect(round.votes).toEqual([]);
    expect(round.shuffledAnswerIds).toBeNull();
  });
});

describe('addAnswer', () => {
  it('refuse une réponse vide ou faite d’espaces', () => {
    const round = createRound(question, players);
    expect(() => addAnswer(round, 'a', '   ')).toThrow();
  });

  it('refuse deux réponses du même joueur', () => {
    const round = addAnswer(createRound(question, players), 'a', 'une réponse');
    expect(() => addAnswer(round, 'a', 'une autre')).toThrow();
  });

  it('retire les espaces autour du texte', () => {
    const round = addAnswer(createRound(question, players), 'a', '  salut  ');
    expect(round.answers[0].text).toBe('salut');
  });

  it('mélange les réponses seulement quand tout le monde a répondu', () => {
    let round = createRound(question, players);
    round = addAnswer(round, 'a', 'un');
    round = addAnswer(round, 'b', 'deux');
    expect(round.shuffledAnswerIds).toBeNull();
    round = addAnswer(round, 'c', 'trois');
    expect(round.shuffledAnswerIds).toHaveLength(3);
    expect([...(round.shuffledAnswerIds ?? [])].sort()).toEqual(round.answers.map(({ id }) => id).sort());
  });
});

describe('assignVote', () => {
  it('refuse d’attribuer deux réponses à la même personne', () => {
    const round = fullRound();
    const [first, second] = round.answers;
    const voted = assignVote(round, first.id, 'a');
    expect(() => assignVote(voted, second.id, 'a')).toThrow();
  });

  it('refuse de voter deux fois pour la même réponse', () => {
    const round = fullRound();
    const voted = assignVote(round, round.answers[0].id, 'a');
    expect(() => assignVote(voted, round.answers[0].id, 'b')).toThrow();
  });

  it('ne modifie pas la manche d’origine', () => {
    const round = fullRound();
    assignVote(round, round.answers[0].id, 'a');
    expect(round.votes).toEqual([]);
  });
});

describe('undoLastVote', () => {
  it('annule seulement le dernier vote', () => {
    const round = fullRound();
    let voted = assignVote(round, round.answers[0].id, 'a');
    voted = assignVote(voted, round.answers[1].id, 'b');
    const undone = undoLastVote(voted);
    expect(undone.votes).toEqual([{ answerId: round.answers[0].id, guessedPlayerId: 'a' }]);
  });

  it('ne plante pas quand il n’y a aucun vote', () => {
    expect(undoLastVote(fullRound()).votes).toEqual([]);
  });
});

describe('availablePlayerIds', () => {
  it('retire les joueurs déjà choisis et laisse le dernier imposé', () => {
    const round = fullRound();
    let voted = assignVote(round, round.answers[0].id, 'a');
    voted = assignVote(voted, round.answers[1].id, 'b');
    expect(availablePlayerIds(voted)).toEqual(['c']);
  });
});
