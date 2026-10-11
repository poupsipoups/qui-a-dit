import { createCustomQuestion, isCustomQuestion } from './custom';

describe('createCustomQuestion', () => {
  it('nettoie le texte et se reconnaît comme question de partie', () => {
    const question = createCustomQuestion('  Quel est   ton plat ?  ');
    expect(question.text).toBe('Quel est ton plat ?');
    expect(isCustomQuestion(question)).toBe(true);
  });

  it('ne confond pas avec une question de la liste', () => {
    expect(isCustomQuestion({ id: 'seed-dish', text: 'Quel est ton plat préféré ?', origin: 'official' })).toBe(false);
  });
});
