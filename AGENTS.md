# Instructions pour les agents

Ce dépôt est le fork Gward de
[`react-native-country-codes-picker`](https://github.com/GeorgeHop/react-native-country-codes-picker)
(sélecteur de pays et d'indicatif téléphonique). Il est maintenu sur
`gward-projects/react-native-country-codes-picker` ; le dépôt d'origine n'est pas déclaré comme
remote (`git remote add upstream <url>` pour fusionner ses changements).

## Rôle et consommateur

Le seul consommateur est **gward-app**, qui installe ce fork depuis Git (commit épinglé dans son
`package.json`) et ne l'importe qu'à travers un seul composant d'enveloppe.

Le point d'entrée (`main`) est `index.tsx` : `yarn typecheck` de gward-app compile donc les sources
de ce fork avec le tsconfig de l'app. Un fork qui passe ses propres contrôles doit donc aussi passer
ceux de l'app.

## Règle principale

Appliquer les pratiques de gward-app : conventions, tsconfig, lint, tests et vérification. En cas de
doute, regarder comment gward-app fait et faire de même.

- **TypeScript partout** : pas de JavaScript lorsqu'il est simplement évitable, fichiers de
  configuration compris (`eslint.config.ts`).
- Les options du tsconfig sont communes aux trois forks (`react-native-country-codes-picker`,
  `react-native-date-picker`, `react-native-web-maps`), seuls les `types` diffèrent : options
  strictes de gward-app, plus `noUncheckedIndexedAccess`, `noImplicitReturns` et
  `allowUnreachableCode: false`. Les modifier dans les trois forks à la fois.
- Le code de la bibliothèque s'exécute sous React Native : le `tsconfig.json` racine ne charge pas
  les types Node, si bien qu'une API Node (`process`, `Buffer`…) y est refusée. Les tests et les
  scripts de contrôle, exécutés par Node, ont leur propre tsconfig (`tests/tsconfig.json`,
  `tools/checks/tsconfig.json`) qui étend le premier et ajoute `node` ; `yarn typecheck` vérifie
  les trois.
- Le champ `files` de `package.json` limite le paquet installé par gward-app au code de la
  bibliothèque : l'étendre lors de l'ajout d'un dossier de sources.
- Dépendances de développement : seulement celles qui servent, sans doublon dans le lockfile
  (`yarn dedupe --check`, lancé par `yarn check`, doit passer). Yarn les installe aussi lorsque gward-app installe le fork
  depuis Git.
- Versions : les forks suivent les dernières versions publiées (gward-app est mis à jour ensuite),
  sauf TypeScript, qui reste en 6.x tant qu'Expo et React Native ne prennent pas en charge
  TypeScript 7.
- Le code doit aussi compiler avec la version de React Native de gward-app, qui peut être en
  retard sur celle des forks : avant d'épingler un nouveau commit dans gward-app, vérifier
  `yarn typecheck` de l'app avec ce commit installé. Les forks comme l'app utilisent les types
  stricts de React Native (`types_generated`, par défaut depuis la 0.87).
- Ne pas profiter d'une tâche pour refactoriser ce qui n'est pas demandé ; chaque écart avec
  l'amont rend les fusions depuis l'amont plus difficiles.

## Commandes

| Commande | Usage |
| -------- | ----- |
| `yarn check` | garde complète, lancée par le pre-commit : lint, typecheck et `yarn dedupe --check` en parallèle, puis tests ; un contrôle en échec est signalé avec son code de sortie |
| `yarn lint` | ESLint bloquant (`--max-warnings=0`) |
| `yarn typecheck` | TypeScript bloquant |
| `yarn test` | suites `node:test` de `tests/` (`tools/checks/test.ts`) |
| `yarn setup-hooks` | installe le hook Husky : **à lancer une fois après chaque clone** |

Il n'y a volontairement pas de script `prepare` : pour une dépendance Git, Yarn exécute `prepare`
dans le fork à chaque installation de gward-app.

## Tests

Les tests vivent dans `tests/` et reflètent l'arborescence des sources (`index.tsx`, `components/`,
`constants/`, `helpers/`, `types/`) : un fichier source couvert a un seul fichier de test miroir,
suffixé `.test.ts`. Ils s'exécutent avec `node --import tsx --test`, sans bibliothèque de mock. Le
lanceur échoue si `tests/` est absent ou vide.

Toute modification de code impose de passer en revue les tests des fichiers touchés : en ajouter, en
corriger ou en supprimer, comme dans
gward-app.

Hors d'atteinte en l'état : les composants `index.tsx` et `components/CountryButton.tsx`, et
`helpers/useKeyboardStatus.ts` (ils importent `react-native`).

## Fichiers copiés de gward-app

Ces fichiers sont des copies d'outils de gward-app : quand l'original change, mettre à jour les
trois forks. La correspondance avec les originaux est tenue dans gward-app (vérification des
écarts entre dépôts).

- `tools/eslint/sortImportsByFirstName.ts` (convertie en TypeScript) et son test ;
- `tools/checks/staticChecks.ts` et son test ;
- `tools/checks/check.ts` et `tools/checks/test.ts`, réduits à ce qu'un fork contrôle ;
- `.husky/pre-commit` ;
- les règles d'`eslint.config.ts`, sans les restrictions d'imports propres à l'app.

`eslint.config.ts` ajoute un `pathGroups` qui range les paquets `react-native*` parmi les
bibliothèques : la configuration Expo les ignore lors de la résolution, ce qui classait leurs
imports de types avec les modules du projet.

## Écarts avec l'amont

- outillage de gward-app ajouté : lint, tests `node:test`, `yarn check`, pre-commit, Dependabot,
  documentation agents (`AGENTS.md`, `JOURNAL.md`) ; champ `files` limité au code de la
  bibliothèque ;
- TypeScript strict (tsconfig commun aux forks) ;
- `helpers/countryName.ts` : nom du pays dans la langue demandée, repli sur l'anglais, utilisé
  pour l'affichage, le tri et la recherche ;
- `CountryItem.name` exige une clé `en` ;
- `CountryList` recalcule sa recherche quand `lang` ou la liste des pays change ;
- `CountryPicker` : l'ouverture et la fermeture restent celles de l'amont (`setShowModal` dans un
  effet, règle `set-state-in-effect` désactivée sur cette ligne). Deux tentatives ont été écartées
  le 18 octobre 2026 après des tests dans gward-app : dériver l'ouverture pendant le rendu laissait
  la modale invisible (web et iOS) ; ignorer la fin d'une fermeture interrompue la laissait bloquée
  ouverte après des clics rapides, iOS pouvant signaler `onShow` pendant la fermeture. Ne pas
  réintroduire ces changements sans test sur appareil ;
- `CountryPicker` : un toucher sur le fond n'appelle `onBackdropPress` qu'une fois l'animation
  d'ouverture terminée (`isOpened`), pour que des clics rapides n'interrompent pas l'ouverture.

## Dépendances

Une montée de versions qui demande d'examiner des différences se consigne dans
[`JOURNAL.md`](./JOURNAL.md), selon la méthode de gward-app.

Dependabot (`.github/dependabot.yml`) vérifie une fois par mois, sur la branche par défaut. Ses PR
ne servent que de **veille** : elles signalent qu'une version est sortie, la montée se fait à la
main. Ne pas proposer de les fusionner, de les fermer ni de les rebaser. Le groupe
`security-updates` laisse passer les versions majeures volontairement. Le `cooldown` d'un jour
aligne les PR sur `npmMinimalAgeGate` : une version n'est signalée qu'une fois installable ; les
alertes de sécurité de Dependabot n'y sont pas soumises.

## Commits et poussées

Ne créer un commit ou pousser que sur demande explicite du propriétaire. Après un commit poussé,
gward-app doit être mis à jour pour pointer vers le nouveau commit.

## Vérification avant de conclure

1. relire le diff et vérifier qu'il reste limité à la demande ;
2. exécuter `yarn check` ;
3. mettre à jour `AGENTS.md` ou `JOURNAL.md` si le changement les invalide ;
4. signaler toute vérification non exécutée (appareil, navigateur, build natif) et sa raison.
