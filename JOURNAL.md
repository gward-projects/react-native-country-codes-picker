# Journal des mises à jour de dépendances

**Nature :** historique vivant des revues de versions · **Dernière mise à jour :** 17 octobre 2026.

Ce fichier suit les mêmes règles que le journal de gward-app
(`documentation/journal-mises-a-jour-dependances.md`), dont il reprend le format.

## Règles de tenue

Pour chaque mise à jour qui justifie une revue fonctionnelle ou technique, ajouter une entrée datée
indiquant :

- les packages et le passage de versions concerné ;
- les changements de comportement ou nouvelles API réellement examinés ;
- les évolutions adoptées dans le code ;
- les évolutions non adoptées, avec une raison concrète ;
- les vérifications exécutées et leurs limites, notamment l'absence de test interactif, natif ou
  dans le navigateur.

Chaque correctif annoncé comme un apport doit être rattaché à la version exacte qui le porte, en
comparant les archives npm et les commits amont (voir « Vérifier les changements réels » dans
`documentation/procedures/agents/mettre-a-jour-dependances.md` de gward-app). Une simple montée
sans différence à analyser ne nécessite pas d'entrée.

## 17 octobre 2026 — React Native 0.88, React 19.3, TypeScript 6 et alignement sur gward-app

| Package | Départ | Arrivée |
| ------- | ------ | ------- |
| Yarn (`packageManager`) | 4.13.0 | 4.18.1 |
| `react` | 19.2.3 | 19.3.0 |
| `react-native` | 0.84.1 | 0.88.0 |
| `@types/react` | 19.2.14 | 19.3.0 |
| `typescript` | 5.9.3 | 6.0.3 |

### Changements de code

- Les types de React Native 0.88 (`types_generated`, lus via `moduleResolution: "bundler"`)
  refusent `null` pour `ListHeaderComponent` : `undefined` à la place, sans effet à l'exécution.
- `noUncheckedIndexedAccess` : `CountryItem.name` exige une clé `en` ; `helpers/countryName.ts`
  donne le nom traduit ou l'anglais. Une langue sans traduction ne fait plus planter le tri ni la
  recherche.
- `react-hooks/exhaustive-deps` : `CountryList` ne recalculait pas sa recherche quand `lang` ou la
  liste changeait ; corrigé. Le tri ne modifie plus la liste mémorisée en place. L'ouverture et la
  fermeture de la modale restent celles de l'amont (règle `set-state-in-effect` désactivée sur une
  ligne) : les deux tentatives de les réécrire ont échoué dans gward-app (voir `AGENTS.md`). Un
  toucher sur le fond n'est pris en compte qu'une fois l'ouverture terminée (2.4.1).

### Alignement sur gward-app

- tsconfig strict commun aux trois forks (`moduleResolution: "bundler"`,
  `customConditions: ["react-native"]`, options strictes de gward-app plus
  `noUncheckedIndexedAccess`, `noImplicitReturns`, `allowUnreachableCode: false`) ;
- ESLint 9.39.5 + `eslint-config-expo` 58.0.4 en configuration TypeScript (`jiti` 2.7.0), avec
  `import/order` et la règle `sort-imports-by-first-name` copiée de gward-app ;
- tests `node:test` + `tsx` 4.23.15 dans `tests/`, `@types/node` 24.19.2 ;
- `yarn check` et pre-commit Husky 9.1.7, installé par `yarn setup-hooks` (pas de `prepare`) ;
- `.yarnrc.yml` réduit à `nodeLinker: node-modules` : les lignes ajoutées par `yarn set version`
  (`enableScripts`, `npmMinimalAgeGate: 0`, `approvedGitRepositories`) désactivaient les nouvelles
  protections de Yarn sans besoin pour le fork.

### Évolutions non adoptées

- **TypeScript 7** : Expo 58 et React Native 0.88 ne le prennent pas encore en charge ; les forks
  restent en 6.0.3, comme gward-app.
- **Babel 8** : n'est plus utilisé par les forks (aucune transformation Babel).
- **ESLint 10** : `eslint-plugin-import`, utilisé par `eslint-config-expo`, ne le prend pas encore
  en charge ; ESLint reste en 9.39.5, comme gward-app.

### Vérifications et limites

- `yarn check` : lint, typecheck et 23 tests passent.
- Ajout des tests de `countryName`, `countriesRemover`, `removeDiacritics`, de la règle ESLint et
  des scripts de contrôle.
- **Non fait** : comparaison des archives npm et des commits amont entre versions de départ et
  d'arrivée. Les versions n'interviennent qu'en développement (les `peerDependencies` restent à
  `*`) ; seules les erreurs de compilation et de lint ont été analysées.
- Testé dans gward-app par le propriétaire sur le web, iOS et Android avec 2.4.1 (ouverture,
  fermeture, clics rapides, recherche, tri).
