import { CHARACTER_COLORS, CHARACTER_KINDS, characterFor, characterOf, pickCharacter } from './character';
import type { Player } from './types';

describe('characterFor', () => {
  it('est stable pour un même seed', () => {
    expect(characterFor('player-1')).toEqual(characterFor('player-1'));
  });

  it('reste dans les bornes', () => {
    for (let i = 0; i < 200; i += 1) {
      const { kind, color } = characterFor(`player-${i}-${Math.random()}`);
      expect(kind).toBeGreaterThanOrEqual(0);
      expect(kind).toBeLessThan(CHARACTER_KINDS);
      expect(color).toBeGreaterThanOrEqual(0);
      expect(color).toBeLessThan(CHARACTER_COLORS);
    }
  });
});

describe('characterOf', () => {
  it('préfère le personnage enregistré, sinon retombe sur l’id', () => {
    expect(characterOf({ id: 'a', character: { kind: 2, color: 4 } })).toEqual({ kind: 2, color: 4 });
    expect(characterOf({ id: 'a' })).toEqual(characterFor('a'));
  });
});

describe('pickCharacter', () => {
  it('donne 5 couleurs différentes aux 5 premiers joueurs, quel que soit le hasard', () => {
    for (let run = 0; run < 50; run += 1) {
      const players: Pick<Player, 'id' | 'character'>[] = [];
      for (let i = 0; i < CHARACTER_COLORS; i += 1) players.push({ id: `p${i}`, character: pickCharacter(players) });
      expect(new Set(players.map((p) => p.character!.color)).size).toBe(CHARACTER_COLORS);
    }
  });

  it('réutilise les couleurs de façon équilibrée au-delà de 5', () => {
    const players: Pick<Player, 'id' | 'character'>[] = [];
    for (let i = 0; i < 10; i += 1) players.push({ id: `p${i}`, character: pickCharacter(players) });
    const counts = Array.from({ length: CHARACTER_COLORS }, (_, c) => players.filter((p) => p.character!.color === c).length);
    expect(counts.every((n) => n === 2)).toBe(true);
  });

  it('compte aussi les joueurs sans personnage enregistré', () => {
    const legacy = { id: 'old-1' };
    const picked = pickCharacter([legacy], () => 0);
    expect(picked.color).not.toBe(characterFor('old-1').color);
  });
});
