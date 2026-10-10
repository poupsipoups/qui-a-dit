import { CHARACTER_COLORS, CHARACTER_KINDS, characterFor } from './character';

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

  it('varie selon le seed', () => {
    const combos = new Set(Array.from({ length: 100 }, (_, i) => JSON.stringify(characterFor(`id-${i}`))));
    expect(combos.size).toBeGreaterThan(5);
  });
});
