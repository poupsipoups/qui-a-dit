export type Character = { kind: number; color: number };

/** `character` : personnage choisi à la création ; absent pour les joueurs plus anciens (repli sur l'id). */
export type Player = { id: string; name: string; photoUri?: string; createdAt: string; character?: Character };
