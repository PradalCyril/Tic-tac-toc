# Composants

Référence de chaque composant React du projet.

## Hiérarchie

```
<StrictMode>
  └── <BrowserRouter>
        └── <App>
              └── <Routes>
                    ├── <HomePage>           sur "/"
                    └── <GamePage>           sur "/play/:name1/:name2"
                          └── <Cell> × 9
```

---

## `main.tsx`

Bootstrap de l'application. Crée la racine React et monte `<App>` dans `<StrictMode>` + `<BrowserRouter>`.

```tsx
createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
)
```

Lève une erreur explicite si `#root` est absent du HTML.

---

## `App`

Fichier : `src/App.tsx`

Composant de routing. Aucune logique métier.

```tsx
<Routes>
  <Route path='/' element={<HomePage />} />
  <Route path='/play/:name1/:name2' element={<GamePage />} />
</Routes>
```

---

## `HomePage`

Fichier : `src/components/HomePage/index.tsx`

Écran d'accueil. Formulaire avec deux champs et un bouton Play.

| Élément | Détail |
|---|---|
| **État** | `useState<{ player1: string, player2: string }>` |
| **Navigation** | `useNavigate()` de react-router |
| **Logo** | SVG inliné via `import Logo from '../../assets/tic-tac-toe.svg?react'` |

### Validation

- Les noms vides (`trim()`) bloquent la soumission.
- Si `player1 === player2`, on suffixe le second avec `2` (pour éviter une route ambiguë).
- Les noms sont encodés via `encodeURIComponent` avant injection dans l'URL (gère les espaces, slashes, etc.).

### Props

Aucune.

---

## `GamePage`

Fichier : `src/components/GamePage/index.tsx`

Cœur du jeu. Contient toute la logique de partie.

### Types

```ts
type CellName = '1-1' | '1-2' | … | '3-3'
type CellState = { checked: boolean; checkedBy: string }
type CellsState = Record<CellName, CellState>
type Outcome = { stopGame: boolean; isWin: boolean; winner: string }
```

### État

| Variable | Type | Rôle |
|---|---|---|
| `playerNameTurn` | `string` | Nom du joueur dont c'est le tour. |
| `cells` | `CellsState` | Grille 3×3, état de chaque case. |
| `outcome` | `Outcome` (mémoïsé) | Résultat dérivé de `cells`. |

### Actions

- `playCell(name)` — coche la case, change de joueur. No-op si la case est déjà cochée ou si la partie est finie.
- `resetGame()` — remet `playerNameTurn = name1` et la grille à vide. Conserve les noms.

### Rendu conditionnel

```
outcome.isWin     → <h1>Bravo {winner} !!!!!</h1>
outcome.stopGame  → <h1>Match Nul !</h1>  (si !isWin)
sinon             → nom du joueur courant en haut/bas selon name1/name2
```

Quand la partie est finie, la grille est cachée et deux boutons apparaissent : « rejouer avec de nouvelles personnes » (Link vers `/`) et « rejouer avec les mêmes personnes » (appelle `resetGame`).

### Props

Aucune. Les noms sont lus via `useParams()`.

---

## `Cell`

Fichier : `src/components/GamePage/Cell/Cell.tsx`

Case présentationnelle pure. **Aucun état local.**

### Props

| Prop | Type | Description |
|---|---|---|
| `className` | `string` | Classe CSS (gère bordures et coins arrondis selon position). |
| `name` | `CellName` | Identifiant `'row-col'` de la case. |
| `ownedBy` | `string` | Nom du joueur qui a coché la case, ou `''` si libre. |
| `isPlayer1Icon` | `boolean` | Si vrai → affiche le rond, sinon → la croix. |
| `disabled` | `boolean` | Si vrai, le clic est ignoré (case déjà jouée ou partie finie). |
| `onPlay` | `(name: CellName) => void` | Callback de clic. |

### Rendu

```tsx
<div className={className} onClick={handleClick}>
  {ownedBy && (isPlayer1Icon ? <Rond /> : <Croix />)}
</div>
```

`<Rond>` et `<Croix>` sont des **composants React générés par svgr** à partir des fichiers `.svg`. Pas de balise `<img>`, pas de requête réseau.

### Convention de couleur/icône

| Joueur | Icône | Couleur du nom |
|---|---|---|
| `name1` (joue en premier) | Rond | Rouge |
| `name2` | Croix | Vert |
