/** Clé de comparaison des questions : doit rester alignée avec public.normalize_question_text en SQL. */
export function normalizeQuestionText(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’ʼ]/g, "'")
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase();
}
