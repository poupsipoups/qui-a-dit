import { playerInitials } from './initials';

describe('playerInitials', () => {
  it('prend les initiales de deux mots', () => expect(playerInitials('Marie Dupont')).toBe('MD'));
  it('prend les deux premières lettres d’un mot seul', () => expect(playerInitials('Pauline')).toBe('PA'));
  it('gère les prénoms composés et les espaces', () => {
    expect(playerInitials('  jean-paul ')).toBe('JP');
    expect(playerInitials('Léa')).toBe('LÉ');
  });
  it('gère une seule lettre ou un nom vide', () => {
    expect(playerInitials('A')).toBe('A');
    expect(playerInitials('   ')).toBe('?');
  });
});
