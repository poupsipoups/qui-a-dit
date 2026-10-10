import type { Question } from './types';

const CUSTOM_PREFIX = 'custom-';

/** Question écrite pour une seule partie : elle n'est pas dans la liste tant qu'on ne l'y ajoute pas. */
export function createCustomQuestion(text: string): Question {
  const cleaned = text.trim().replace(/\s+/g, ' ');
  return { id: `${CUSTOM_PREFIX}${cleaned}`, text: cleaned, origin: 'suggestion' };
}

export const isCustomQuestion = (question: Question) => question.id.startsWith(CUSTOM_PREFIX);
