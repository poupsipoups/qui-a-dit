import type { Player } from '@/features/players/types';
import type { Question } from '@/features/questions/types';
import type { Answer, Round, Vote } from './types';

export function shuffle<T>(items: readonly T[]): T[] {
  const output = [...items];
  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }
  return output;
}

export function createRound(question: Question, players: readonly Player[]): Round {
  return { question, turnOrder: shuffle(players.map(({ id }) => id)), answers: [], shuffledAnswerIds: null, votes: [] };
}

export function addAnswer(round: Round, authorId: string, text: string): Round {
  const cleanText = text.trim();
  if (!cleanText) throw new Error('Une réponse ne peut pas être vide.');
  if (round.answers.some((answer) => answer.authorId === authorId)) throw new Error('Ce joueur a déjà répondu.');
  const answer: Answer = { id: `${authorId}-${Date.now()}-${Math.random().toString(36).slice(2)}`, authorId, text: cleanText };
  const answers = [...round.answers, answer];
  return { ...round, answers, shuffledAnswerIds: answers.length === round.turnOrder.length ? shuffle(answers.map(({ id }) => id)) : null };
}

export function assignVote(round: Round, answerId: string, guessedPlayerId: string): Round {
  if (round.votes.some((vote) => vote.guessedPlayerId === guessedPlayerId)) throw new Error('Cette personne est déjà attribuée.');
  if (round.votes.some((vote) => vote.answerId === answerId)) throw new Error('Cette réponse a déjà un vote.');
  return { ...round, votes: [...round.votes, { answerId, guessedPlayerId }] };
}

export function undoLastVote(round: Round): Round {
  return { ...round, votes: round.votes.slice(0, -1) };
}

export function availablePlayerIds(round: Round): string[] {
  const used = new Set(round.votes.map((vote) => vote.guessedPlayerId));
  return round.turnOrder.filter((id) => !used.has(id));
}

export function answerForId(round: Round, answerId: string) { return round.answers.find((answer) => answer.id === answerId); }
export function voteForAnswer(round: Round, answerId: string): Vote | undefined { return round.votes.find((vote) => vote.answerId === answerId); }
