export const CHARACTER_KINDS = 3;
export const CHARACTER_COLORS = 5;

/** Choix stable : le même `seed` (l'id du joueur) donne toujours le même personnage et la même couleur. */
export function characterFor(seed: string): { kind: number; color: number } {
  let hash = 5381;
  for (const char of seed) hash = (Math.imul(hash, 33) + char.codePointAt(0)!) >>> 0;
  return { kind: hash % CHARACTER_KINDS, color: Math.floor(hash / CHARACTER_KINDS) % CHARACTER_COLORS };
}
