/** Deux lettres : initiales des deux premiers mots, ou deux premières lettres d’un mot seul. */
export function playerInitials(name: string): string {
  const words = name.trim().split(/[\s-]+/).filter(Boolean);
  if (words.length === 0) return '?';
  const letters = words.length > 1 ? words.slice(0, 2).map((word) => Array.from(word)[0]) : Array.from(words[0]).slice(0, 2);
  return letters.join('').toLocaleUpperCase('fr');
}
