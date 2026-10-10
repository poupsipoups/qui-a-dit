import type { Character, Player } from './types';

export const CHARACTER_KINDS = 3;
export const CHARACTER_COLORS = 5;

/** Repli stable pour un joueur sans personnage enregistré : dérivé de son id. */
export function characterFor(seed: string): Character {
  let hash = 5381;
  for (const char of seed) hash = (Math.imul(hash, 33) + char.codePointAt(0)!) >>> 0;
  return { kind: hash % CHARACTER_KINDS, color: Math.floor(hash / CHARACTER_KINDS) % CHARACTER_COLORS };
}

export const characterOf = (player: Pick<Player, 'id' | 'character'>): Character => player.character ?? characterFor(player.id);

/** Couleur la moins utilisée (au hasard parmi les ex æquo), expression au hasard : les 5 premiers joueurs ont 5 couleurs différentes. */
export function pickCharacter(players: readonly Pick<Player, 'id' | 'character'>[], random: () => number = Math.random): Character {
  const counts = Array.from({ length: CHARACTER_COLORS }, () => 0);
  for (const player of players) counts[characterOf(player).color] += 1;
  const least = Math.min(...counts);
  const colors = counts.flatMap((count, color) => (count === least ? [color] : []));
  return { kind: Math.floor(random() * CHARACTER_KINDS), color: colors[Math.floor(random() * colors.length)] };
}
