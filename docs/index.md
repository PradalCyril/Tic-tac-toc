# Tic Tac Toe — Documentation

Petit jeu de morpion à deux joueurs, écrit en React 19 + TypeScript + Vite.

- **Démo en ligne** : <https://modest-benz-601a77.netlify.app/>
- **Repo** : branche `master` (prod) / `dev` (historique) / `modernize` (stack actuelle)

## Sommaire

| Section | Quand la lire |
|---|---|
| [Démarrage rapide](getting-started.md) | Installer, lancer, builder le projet. |
| [Architecture](architecture.md) | Comprendre l'arborescence, le flux des données, les responsabilités. |
| [Stack technique](stack.md) | Versions, choix de librairies, configuration TypeScript. |
| [Composants](components.md) | Référence de chaque composant React (props, état, responsabilité). |
| [Logique du jeu](game-logic.md) | Règles, détection de victoire, gestion des tours. |
| [Performance & assets](performance.md) | Pourquoi les SVG sont inlinés et comment ça supprime la latence au premier clic. |
| [Déploiement](deployment.md) | Configuration Netlify, alternatives. |

## Arborescence de la documentation

```
docs/
├── index.md              ← vous êtes ici
├── getting-started.md    ← installation et scripts
├── architecture.md       ← arborescence et flux
├── stack.md              ← versions et choix techniques
├── components.md         ← référence composants
├── game-logic.md         ← règles et algorithmes
├── performance.md        ← inlining SVG et bundling
└── deployment.md         ← Netlify et hébergement
```

## En une minute

Le jeu est une SPA composée de deux écrans :

```
  /                          /play/:name1/:name2
  ┌───────────────┐          ┌──────────────────┐
  │   HomePage    │ ───────► │    GamePage      │
  │ saisie noms   │          │  grille 3×3      │
  │ bouton Play   │          │  Cell × 9        │
  └───────────────┘          └──────────────────┘
```

L'état du jeu (cases cochées, joueur courant) vit dans `GamePage`. Les `Cell` sont purement présentationnelles. La détection de victoire est recalculée à chaque rendu via `useMemo`.

Pour les détails, voir [architecture.md](architecture.md).
