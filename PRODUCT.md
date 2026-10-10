# Product

<!-- impeccable:product-schema 1 -->

## Platform

ios

## Users

A small private group of friends (3 to 10 people), French-speaking, in the same room at a party, passing a single phone around. One person sets up the game; everyone takes turns answering privately, then the group votes together. Distribution is a private circle (dev build / TestFlight style), not a public store launch.

## Product Purpose

Party game on one phone: a random question is drawn, everyone answers in secret, answers are shuffled and anonymised, the group votes "qui a dit ça ?" for each answer, then authors are revealed. Success is the laugh at the reveal, not competition. V1 is one round per game, no score, no account.

## Positioning

Pass-the-phone anonymity with faces: players are real friends with photos, so the vote and the reveal are about people you know, not generic avatars. Works fully offline with an embedded question seed; network only enriches the question bank.

## Operating Context

- One shared phone, handed between players; the answer must disappear after validation and a "Passe le téléphone à …" screen precedes each turn.
- The whole group looks at the screen during voting and reveal (glanceable from a distance, faces large).
- Question bank: embedded seed plus Supabase catalog and user suggestions; works offline.
- Players and photos are stored locally on the phone only.

## Capabilities and Constraints

- 3 to 10 players; photo optional per player (camera or library), initials shown when absent.
- Question drawn at random among active questions; start blocked if none active or fewer than 3 players.
- Turn order shuffled per question; answers shuffled independently of turn order; author never shown before reveal.
- Guided vote: already-assigned faces stay visible but disabled; going back undoes the previous vote; last card is forced and announced as such.
- Questions screen: per-question active toggle, "Dans la boîte" / "Proposées" sections, propose a question (Supabase).
- Expo / React Native app (Expo Router, Reanimated); portrait only; light mode only.
- Out of V1 scope: multiple questions per game, manual question selection, scores, accounts, friend sync, community moderation. Multi-question modes are V2.

## Brand Commitments

- Name: "Qui a dit ?" (French-only copy, informal tutoiement, playful tone).
- Pink background `#F6C8D5` and the mascot are kept identity elements (confirmed by the user).

## Evidence on Hand

- Product spec: `docs/spec.md`; implementation plan: `docs/plan.md`.
- Seed questions: `src/features/questions/seed.ts`.
- Existing assets: `assets/images/app-icon.png`, favicon, mascot component. No testimonials, store listing, or usage data exist; none should be invented.

## Product Principles

1. The reveal is the product: every screen serves the moment authors are uncovered.
2. Anonymity must feel trustworthy: nothing on screen may leak who wrote what before the reveal.
3. Built for a shared screen in a loud room: legible at arm's length, one clear action per step.
4. Works offline, no account, no setup friction: three friends and a phone are enough.
5. Faces over text: people (photo or initials), not UI chrome, carry the game.

## Accessibility & Inclusion

No product-specific standard established. French-language only for now; players may have varied photo quality and lighting.
