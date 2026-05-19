# Architecture

## Arborescence

```
Tic-tac-toc/
├── index.html                          ← point d'entrée HTML (chargé par Vite)
├── package.json
├── vite.config.ts                      ← plugins Vite (react + svgr)
├── tsconfig.json                       ← root, références app + node
├── tsconfig.app.json                   ← config TS pour le code src/
├── tsconfig.node.json                  ← config TS pour vite.config.ts
├── public/
│   └── favicon.ico                     ← assets statiques servis tels quels
├── src/
│   ├── main.tsx                        ← bootstrap React + BrowserRouter
│   ├── App.tsx                         ← définition des routes
│   ├── index.css                       ← styles globaux (reset, font-family)
│   ├── vite-env.d.ts                   ← types Vite + svgr
│   ├── assets/
│   │   ├── croix.svg                   ← icône X (inlinée via svgr)
│   │   ├── rond.svg                    ← icône O (inlinée via svgr)
│   │   ├── tic-tac-toe.svg             ← logo (inliné via svgr)
│   │   └── papier-ancien.jpg           ← texture de fond (référencée en CSS)
│   └── components/
│       ├── HomePage/
│       │   ├── index.tsx               ← écran de saisie des noms
│       │   └── index.css
│       └── GamePage/
│           ├── index.tsx               ← écran de partie, contient l'état
│           ├── index.css
│           └── Cell/
│               └── Cell.tsx            ← case présentationnelle (X ou O)
└── docs/                               ← cette documentation
```

## Couches

```
┌──────────────────────────────────────────────────────────┐
│  Navigateur                                              │
│  ┌────────────────────────────────────────────────────┐  │
│  │  index.html                                        │  │
│  │  └─ <div id="root">                                │  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
                          ▼
┌──────────────────────────────────────────────────────────┐
│  main.tsx                                                │
│  └─ createRoot().render(<StrictMode><BrowserRouter>…)    │
└──────────────────────────────────────────────────────────┘
                          ▼
┌──────────────────────────────────────────────────────────┐
│  App.tsx                                                 │
│  └─ <Routes>                                             │
│       ├─ /                  → <HomePage />               │
│       └─ /play/:n1/:n2      → <GamePage />               │
└──────────────────────────────────────────────────────────┘
                          ▼
        ┌──────────────────┴──────────────────┐
        ▼                                     ▼
┌─────────────────┐                 ┌─────────────────────┐
│  HomePage       │                 │  GamePage           │
│  - useState     │                 │  - useState(cells)  │
│  - useNavigate  │                 │  - useState(turn)   │
│                 │                 │  - useMemo(outcome) │
│  formulaire 2   │                 │                     │
│  champs + Play  │                 │  <Cell> × 9         │
└─────────────────┘                 └─────────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────────┐
                                    │  Cell (présentation)│
                                    │  - reçoit ownedBy   │
                                    │  - rend Croix/Rond  │
                                    │  - appelle onPlay   │
                                    └─────────────────────┘
```

## Flux de données

1. **Saisie des noms** — `HomePage` stocke `{ player1, player2 }` dans son `useState`.
2. **Navigation** — au submit, `useNavigate()` redirige vers `/play/:name1/:name2` (noms encodés via `encodeURIComponent`).
3. **Initialisation de la partie** — `GamePage` lit les noms via `useParams`, crée la grille vide (`createEmptyCells`) et fixe `playerNameTurn = name1`.
4. **Clic d'un joueur** — `Cell` appelle `onPlay(name)` → `GamePage.playCell` met à jour `cells[name]` et inverse `playerNameTurn`.
5. **Détection** — `useMemo(() => computeOutcome(cells), [cells])` recalcule `{ stopGame, isWin, winner }` à chaque changement de grille.
6. **Fin de partie** — si `outcome.stopGame`, la grille est masquée et deux boutons proposent de rejouer.

## Décisions de conception

| Décision | Justification |
|---|---|
| État du jeu dans `GamePage` uniquement | Pas de prop drilling profond (un seul niveau vers `Cell`), pas de Redux/Zustand nécessaire pour si peu d'état. |
| `Cell` sans état local | L'état était dupliqué dans la version 2019 (parent + enfant), source de bugs. Le rendu dérive entièrement des props. |
| `computeOutcome` pur + `useMemo` | Logique testable en isolation, recalcul seulement quand `cells` change. |
| `WINNING_LINES` tableau de 8 triplets | Remplace 8 blocs `if` quasi-identiques et un `compteur` incrémenté à la main. |
| SVG inlinés via svgr | Voir [performance.md](performance.md) — supprime la latence au premier clic. |
