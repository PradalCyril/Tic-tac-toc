# Stack technique

## Versions

| Outil | Version | Rôle |
|---|---|---|
| React | ^19.0.0 | UI |
| react-dom | ^19.0.0 | rendu DOM |
| react-router | ^7.1.1 | routing client (mode library, pas framework) |
| Vite | ^6.0.7 | build & dev server |
| @vitejs/plugin-react | ^4.3.4 | Fast Refresh, JSX, Babel |
| vite-plugin-svgr | ^4.3.0 | imports SVG → composants React |
| TypeScript | ^5.7.2 | typage statique strict |

## Configuration Vite

`vite.config.ts` est minimal :

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()]
})
```

- `react()` active Fast Refresh et la transformation JSX.
- `svgr()` permet les imports `import Icon from './foo.svg?react'` qui rendent l'SVG comme composant React (voir [performance.md](performance.md)).

## Configuration TypeScript

Architecture en project references (recommandée par l'équipe Vite) :

```
tsconfig.json (racine, vide, agrège les références)
├── tsconfig.app.json     ← code applicatif (src/**)
└── tsconfig.node.json    ← config Vite (vite.config.ts)
```

### Options strictes activées dans `tsconfig.app.json`

- `strict: true` — toutes les vérifications strictes de TS.
- `noUnusedLocals` / `noUnusedParameters` — pas de variables mortes.
- `noFallthroughCasesInSwitch` — pas de fall-through implicite dans les `switch`.
- `noUncheckedSideEffectImports` — refuse les imports d'effet de bord non typés.
- `erasableSyntaxOnly` — interdit la syntaxe TS qui n'a pas d'équivalent JS (enums, namespaces) ; oblige à utiliser `type` plutôt que `interface` pour certaines structures. Aligné avec la direction TC39 « type-only TS ».
- `verbatimModuleSyntax` — impose `import type { … }` quand l'import n'est utilisé qu'à la compilation.
- `isolatedModules` — chaque fichier doit être compilable indépendamment (compatibilité avec esbuild/swc).
- `jsx: 'react-jsx'` — pas besoin d'importer React dans chaque fichier .tsx.

## Choix de routing

`react-router` v7 en mode **library** (BrowserRouter classique) :

```tsx
<BrowserRouter>
  <App />
</BrowserRouter>
```

dans `main.tsx`, puis `<Routes>` / `<Route element={…}>` dans `App.tsx`.

Le mode framework (file-based routing, SSR) n'apporte rien pour un jeu de 2 pages 100 % client.

## Style

- CSS classique, un fichier `.css` par composant (`HomePage/index.css`, `GamePage/index.css`).
- Pas de CSS Modules, pas de Tailwind, pas de styled-components — la surface CSS est trop petite pour justifier un outil.
- Variables d'aspect : texture papier ancien en fond (`papier-ancien.jpg`), bordures arrondies, couleurs joueurs (rouge / vert).

## Choix volontairement écartés

| Outil | Pourquoi pas |
|---|---|
| Next.js | Overkill : pas de SSR, pas de SEO, pas d'API. |
| Redux / Zustand | État trop simple, `useState` suffit. |
| Tests (Jest/Vitest) | Pas en place actuellement ; la logique pure (`computeOutcome`) est facilement testable si besoin. |
| ESLint / Prettier | Pas configurés ; à ajouter si l'équipe s'agrandit. |
