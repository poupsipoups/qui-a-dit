import { normalizeQuestionText } from './normalize';

describe('normalizeQuestionText', () => {
  it('traite l’apostrophe typographique comme l’apostrophe droite', () => {
    expect(normalizeQuestionText('Quelle phrase d’avoir dite ?')).toBe(normalizeQuestionText("Quelle phrase d'avoir dite ?"));
  });

  it('ignore la casse, les accents et les espaces multiples', () => {
    expect(normalizeQuestionText('  Quelle   ÉPOQUE ?  ')).toBe('quelle epoque ?');
  });
});
