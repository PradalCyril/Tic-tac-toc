# Logique du jeu

## Règles

Morpion classique :

- Grille 3×3.
- `name1` joue en premier (rond).
- `name2` joue ensuite (croix).
- Le premier qui aligne 3 symboles (ligne, colonne ou diagonale) gagne.
- Si les 9 cases sont remplies sans alignement, match nul.

## Représentation de la grille

Chaque case porte un nom `'row-col'` :

```
 1-1 │ 1-2 │ 1-3
─────┼─────┼─────
 2-1 │ 2-2 │ 2-3
─────┼─────┼─────
 3-1 │ 3-2 │ 3-3
```

État d'une case :

```ts
type CellState = {
  checked: boolean       // true dès qu'un joueur l'a jouée
  checkedBy: string      // nom du joueur, '' si libre
}
```

État global :

```ts
type CellsState = Record<CellName, CellState>
```

## Lignes gagnantes

Toutes les configurations gagnantes sont énumérées dans un tableau constant :

```ts
const WINNING_LINES: [CellName, CellName, CellName][] = [
  ['1-1', '1-2', '1-3'],   // ligne 1
  ['2-1', '2-2', '2-3'],   // ligne 2
  ['3-1', '3-2', '3-3'],   // ligne 3
  ['1-1', '2-1', '3-1'],   // colonne 1
  ['1-2', '2-2', '3-2'],   // colonne 2
  ['1-3', '2-3', '3-3'],   // colonne 3
  ['1-1', '2-2', '3-3'],   // diagonale ↘
  ['1-3', '2-2', '3-1']    // diagonale ↙
]
```

## Détection de fin de partie

```ts
const computeOutcome = (cells: CellsState): Outcome => {
  for (const [a, b, c] of WINNING_LINES) {
    const owner = cells[a].checkedBy
    if (owner && cells[b].checkedBy === owner && cells[c].checkedBy === owner) {
      return { stopGame: true, isWin: true, winner: owner }
    }
  }
  const allFilled = CELL_NAMES.every((name) => cells[name].checked)
  return { stopGame: allFilled, isWin: false, winner: '' }
}
```

| Résultat | Signification |
|---|---|
| `{ stopGame: false, isWin: false, winner: '' }` | Partie en cours. |
| `{ stopGame: true,  isWin: true,  winner: 'X' }` | Victoire de `X`. |
| `{ stopGame: true,  isWin: false, winner: '' }` | Match nul (toutes les cases remplies, aucun alignement). |

La fonction est **pure** : pas d'effet de bord, pas de dépendance externe. Elle est appelée dans un `useMemo` côté `GamePage`, donc recalculée uniquement quand `cells` change.

## Cycle d'un tour

```
  [clic sur Cell "i-j"]
          │
          ▼
  Cell.handleClick()
          │
          ├── disabled ? → no-op
          │
          ▼
  GamePage.playCell("i-j")
          │
          ├── cells["i-j"].checked ? → no-op
          ├── outcome.stopGame      ? → no-op
          │
          ▼
  setCells(prev => ({ …prev, "i-j": { checked: true, checkedBy: playerNameTurn } }))
  setPlayerNameTurn(curr => curr === name1 ? name2 : name1)
          │
          ▼
  Re-render → useMemo recalcule outcome
          │
          ▼
  Si outcome.stopGame → grille masquée, écran de fin
```

## Reset

`resetGame()` remet la grille à vide et redonne le premier tour à `name1`. Les noms et l'URL restent inchangés (toujours sur `/play/:name1/:name2`).

Pour changer les joueurs, le bouton « Rejouer avec de nouvelles personnes » est un `<Link to="/">` qui ramène au formulaire.

## Cas limites

| Cas | Comportement |
|---|---|
| Clic sur une case déjà jouée | Ignoré (`disabled = true` sur la `Cell`). |
| Clic après victoire / match nul | Ignoré (la grille n'est plus affichée, mais la garde est aussi dans `playCell`). |
| Deux joueurs avec le même nom | Le second est suffixé avec `2` dans `HomePage` avant navigation (voir [components.md](components.md)). |
| Nom avec caractères spéciaux (`/`, espace) | Encodés via `encodeURIComponent` lors de la navigation, décodés automatiquement par `useParams`. |
