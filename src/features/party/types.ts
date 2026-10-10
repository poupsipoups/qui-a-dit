import type { Question } from '@/features/questions/types';

export type Answer = { id: string; authorId: string; text: string };
export type Vote = { answerId: string; guessedPlayerId: string };
export type PartyPhase = 'intro' | 'handoff' | 'answer' | 'vote' | 'reveal' | 'complete';
export type Round = { question: Question; turnOrder: string[]; answers: Answer[]; shuffledAnswerIds: string[] | null; votes: Vote[] };
