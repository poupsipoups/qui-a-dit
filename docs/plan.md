# Qui a dit — plan d’implémentation V1

Ce document décrit **dans quel ordre construire l’app**. Les règles du jeu, le périmètre et la direction visuelle sont dans [spec.md](./spec.md).

## Principes d’exécution

- Construire une partie jouable en local avant d’ajouter Supabase. Le backend ne doit jamais bloquer le cœur du jeu.
- Chaque étape produit un état testable et peut être commitée séparément.
- Garder Expo Router pour les trois destinations : accueil, questions et partie. La partie elle-même reste une route unique, pilotée par un reducer.
- Avant toute API Expo ou dépendance native, vérifier la documentation correspondant à Expo SDK 57. Installer uniquement avec `npx expo install`.
- Terminer chaque étape par `npx tsc --noEmit` et `npx expo lint` ; ne corriger que les fichiers concernés avant de continuer.

## Ordre des livrables

```text
0. Dépôt et configuration
1. Shell visuel et navigation
2. Joueurs locaux
3. Logique de manche testée
4. Partie locale jouable
5. Banque de questions locale
6. Synchronisation Supabase
7. Qualité, appareils et livraison
```

Le jalon important est l’étape 4 : à ce moment, l’app est déjà un jeu complet sans connexion. Supabase arrive seulement ensuite.

## Étape 0 — Dépôt et configuration

### Actions

1. Créer le dépôt GitHub `qui-a-dit` depuis le projet actuel, vérifier le remote et créer le commit initial.
2. Ajouter [spec.md](./spec.md) et ce document au commit initial.
3. Vérifier que `.gitignore` exclut `.env`, les répertoires de build et les données de développement.
4. Garder la mascotte déjà configurée dans [app.json](../app.json) comme icône et splash ; ne pas recréer d’assets natifs à la main.
5. Passer l’interface à un thème clair explicite avant de construire les écrans, pour empêcher l’apparence sombre du système de modifier le fond rose.

### Résultat attendu

- Le projet est versionné, avec un remote GitHub et un historique propre.
- Le démarrage affiche toujours l’app Expo, mais l’icône, le splash et la configuration ont une source unique dans `app.json`.

### Vérification

- `git status` ne montre aucun fichier de secret.
- `npx expo config --type public` résout les chemins de l’icône et du splash.

## Étape 1 — Shell de l’app et langage visuel

### Fichiers à créer ou modifier

- `src/app/_layout.tsx` : stack Expo Router et providers.
- `src/app/index.tsx` : accueil.
- `src/app/questions.tsx` : banque de questions.
- `src/app/game.tsx` : conteneur de partie, vide au départ.
- `src/theme/tokens.ts` et `src/theme/styles.ts` : couleurs, espacements, rayons et ombres.
- `src/components/Screen.tsx`, `CandyCard.tsx`, `PillButton.tsx`, `FaceCard.tsx`.

### Actions

1. Retirer les tabs et les composants de démonstration Expo, sans supprimer les assets utiles avant d’avoir vérifié qu’ils ne sont plus référencés.
2. Créer le fond rose `#F6C8D5`, les cartes pastel et une encre prune foncée. Les cartes n’ont pas de contour noir.
3. Utiliser une typographie système avec des titres semi-gras. Ne pas ajouter de police display dans cette première passe.
4. Poser les états visuels de base : bouton actif, pressé, désactivé ; carte sélectionnée ; état vide ; message d’erreur.
5. Employer un sheet Expo UI pour l’ajout d’un joueur et les suggestions. Le glass est seulement une amélioration iOS : le fallback est une surface pastel translucide en React Native.

### Résultat attendu

L’accueil est visuellement fidèle à la direction : fond rose, mascotte, cartes pastel légères et barre d’actions en bas. Les écrans Questions et Partie sont atteignables, même avec du contenu temporaire.

## Étape 2 — Gestion des joueurs et stockage local

### Modèle

```ts
type Player = {
  id: string;
  name: string;
  photoUri: string;
  createdAt: string;
};
```

### Fichiers à créer

- `src/features/players/types.ts`
- `src/features/players/player-storage.ts`
- `src/features/players/use-players.ts`
- `src/features/players/player-photo.ts`
- `src/features/players/AddPlayerSheet.tsx`

### Actions

1. Installer `expo-image-picker`, `expo-file-system` et AsyncStorage avec Expo.
2. Ajouter un joueur depuis la galerie ou l’appareil photo ; demander la permission seulement au moment de l’action.
3. Copier l’image sélectionnée dans l’espace de documents de l’app, puis enregistrer uniquement cette URI persistante.
4. Ajouter modification du prénom, remplacement de photo et suppression avec confirmation.
5. Enregistrer la liste dans AsyncStorage après chaque changement.
6. Sur suppression, effacer aussi le fichier photo copié lorsqu’il n’est plus utilisé.
7. Appliquer les règles : photo requise, prénom non vide après trim, maximum 40 caractères, 3 à 10 joueurs. Les prénoms identiques restent autorisés car la logique utilise les IDs.

### Vérification

- Après redémarrage, la liste et les photos réapparaissent.
- Une annulation de galerie ou un refus de permission ne crée pas de joueur incomplet.
- « On joue » est désactivé à moins de trois joueurs, et l’ajout du onzième est refusé.

## Étape 3 — Modèle de manche et logique pure

Cette étape ne construit pas encore les écrans de jeu. Elle verrouille les règles, de façon indépendante de React Native.

### Modèles

```ts
type Question = { id: string; text: string; origin: 'official' | 'suggestion' };

type Answer = {
  id: string;
  authorId: string;
  text: string;
};

type Vote = {
  answerId: string;
  guessedPlayerId: string;
};

type PartyPhase = 'handoff' | 'answer' | 'vote' | 'reveal' | 'complete';

type Round = {
  question: Question;
  turnOrder: string[];
  answers: Answer[];
  shuffledAnswerIds: string[] | null;
  votes: Vote[];
};
```

### Fichiers à créer

- `src/features/party/types.ts`
- `src/features/party/logic.ts`
- `src/features/party/logic.test.ts`
- `src/features/party/party-reducer.ts`

### Fonctions obligatoires

1. `shuffle<T>` retourne un nouveau tableau et ne mute jamais son argument.
2. `drawQuestion` choisit seulement parmi les questions actives.
3. `createRound` mélange l’ordre de passage une fois.
4. `submitAnswer` associe le texte à `authorId`, sans jamais exposer cet ID à l’UI de vote.
5. `shuffleAnswersForVoting` ne s’exécute qu’après la dernière réponse et retourne un ordre différent de l’ordre de passage.
6. `assignVote` refuse un joueur déjà attribué à une autre réponse.
7. `undoPreviousVote` retire le dernier vote et rend ce joueur disponible.
8. `remainingPlayer` retourne la personne restante pour l’attribution forcée.

### Tests minimum

- Même contenu, ordre de passage et ordre de vote indépendants.
- Le mélange ne modifie pas la liste de joueurs.
- Impossible d’attribuer deux réponses à la même personne.
- Annuler le dernier vote rend le bon visage sélectionnable.
- À la dernière réponse, une seule personne est disponible.
- Une réponse vide n’est jamais enregistrée.

### Résultat attendu

Le moteur peut être exercé en test sans écran ni réseau, et garantit l’anonymisation jusqu’à la phase de révélation.

## Étape 4 — Première partie jouable, offline

### Fichiers à créer

- `src/features/questions/seed.ts`
- `src/features/party/party-context.tsx`
- `src/features/party/HandoffView.tsx`
- `src/features/party/AnswerView.tsx`
- `src/features/party/VoteView.tsx`
- `src/features/party/RevealView.tsx`

### Actions

1. Ajouter un seed de questions françaises assez varié pour jouer sans réseau.
2. À l’appui sur « On joue », choisir une question active et ouvrir `/game`. La V1 ne montre pas d’écran Setup.
3. Gérer dans une seule route les transitions suivantes :

   ```text
   handoff → answer → handoff → … → vote → reveal → complete
   ```

4. L’écran de passage n’affiche que le prochain prénom et sa photo. La question reste cachée jusqu’à « C’est moi ».
5. Après validation, effacer le champ de réponse et afficher directement l’écran de passage suivant.
6. Lorsque tout le monde a répondu, mélanger une fois le deck de réponses. Cet ordre ne change plus pendant les votes.
7. Sur Vote : afficher une réponse et les visages ; désactiver les personnes déjà attribuées ; proposer de revenir au vote précédent ; annoncer clairement le dernier choix forcé.
8. Sur Révélation : afficher, une par une, la réponse, la personne choisie et l’auteur réel. Aucun score.
9. À la fin, proposer une nouvelle partie ou le retour à l’accueil. Quitter la partie en cours demande confirmation ; le retour système ne doit pas dévoiler une réponse précédente.

### Vérification manuelle

- Jouer à trois avec le seed, sans internet.
- Vérifier que l’ordre de vote ne correspond pas à l’ordre de passage.
- Vérifier que l’auteur n’apparaît nulle part avant Révélation.
- Revenir sur un vote, le corriger, puis terminer la révélation.

## Étape 5 — Banque de questions locale

### Fichiers à créer

- `src/features/questions/types.ts`
- `src/features/questions/question-storage.ts`
- `src/features/questions/use-questions.ts`
- `src/features/questions/QuestionCard.tsx`

### Actions

1. Fusionner le seed et le catalogue local dans une seule liste affichable.
2. Enregistrer les IDs désactivés dans AsyncStorage ; une désactivation est par appareil et ne modifie pas Supabase.
3. Rendre le switch accessible : état lisible, libellé explicite et pas de couleur seule pour signaler on/off.
4. Afficher une alerte utile si toutes les questions sont désactivées, avec un bouton pour en réactiver.
5. Faire en sorte que le démarrage utilise cette source unique de questions actives.

### Vérification

- Une question désactivée reste désactivée après redémarrage.
- Toutes désactivées : « On joue » explique pourquoi la partie ne peut pas commencer.

## Étape 6 — Supabase et suggestions

### Préparation serveur

1. Créer `supabase/migrations/` et une migration SQL versionnée.
2. Créer `questions` avec : `id`, `text`, `normalized_text`, `origin`, `created_at`.
3. Créer une fonction ou un trigger Postgres qui remplit `normalized_text` depuis `text` : minuscules, espaces compressés et accents normalisés. L’unicité doit être imposée par la base, pas seulement par l’app.
4. Ajouter les RLS policies : lecture anonyme ; insertion anonyme seulement si `origin = 'suggestion'` ; aucune mise à jour ou suppression depuis le client.
5. Ajouter le seed officiel dans la migration ou dans un seed versionné.
6. Créer `.env.example` avec `EXPO_PUBLIC_SUPABASE_URL` et `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY` vides. Ne jamais committer `.env`.

### Intégration app

1. Installer `@supabase/supabase-js` et créer `src/lib/supabase.ts`.
2. Au lancement, afficher le seed/cache disponible immédiatement puis récupérer le catalogue en arrière-plan.
3. Persister le dernier catalogue valide dans AsyncStorage, avec une date de dernière mise à jour.
4. En offline, le jeu continue avec cache ou seed. Seule l’action « Proposer une question » affiche une erreur réseau si l’envoi échoue.
5. Ajouter le sheet de suggestion : trim, validation de longueur, insert, gestion du doublon, refetch et affichage immédiat de la nouvelle question.
6. Les suggestions sont visibles immédiatement, conformément au choix produit : il n’y a ni compte ni modération.

### Vérification

- Une suggestion sur un téléphone est visible après refresh sur un autre.
- Une variation de casse, d’espaces ou d’accents est refusée comme doublon.
- Une panne réseau ne casse ni l’accueil ni une partie locale.

## Étape 7 — Finition et validation sur appareils

### Actions

1. Ajouter des haptics légers uniquement aux moments utiles : ajout de joueur, réponse validée, vote confirmé, révélation.
2. Ajouter des transitions courtes ; ne jamais ralentir le passage du téléphone.
3. Vérifier le contraste, les textes agrandis et les états désactivés. Le visage sélectionné doit avoir une indication autre que la couleur.
4. Vérifier le layout sur petits écrans et avec dix joueurs : grille scrollable, photos visibles, pas de bouton caché par le clavier.
5. Tester iOS et Android. Sur les plateformes sans Liquid Glass, conserver le même layout et employer le fallback prévu.
6. Lancer `npx expo-doctor`, `npx expo lint` et `npx tsc --noEmit`.
7. Créer un development build EAS pour tester l’icône, le splash et les modules natifs sur un téléphone réel.

### Scénarios de recette finale

1. Trois joueurs, une question, sans réseau : partie complète et révélation correcte.
2. Dix joueurs : passage, vote et grille de visages restent praticables.
3. Photos refusées/annulées, prénom invalide, suppression de joueur, redémarrage de l’app.
4. Toutes les questions désactivées puis réactivation d’une seule.
5. Suggestion en ligne, suggestion doublon, suggestion hors ligne.
6. Abandon de partie : aucune réponse n’est visible après confirmation de sortie.

## V2 — À ne pas commencer pendant la V1

Quand la V1 est stable, réutiliser le moteur `Round` dans une `Party` contenant plusieurs manches. C’est alors seulement que l’écran Setup, le choix manuel, le compteur plafonné au nombre de questions actives et le récapitulatif par question seront ajoutés.
