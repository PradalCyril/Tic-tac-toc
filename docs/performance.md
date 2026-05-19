# Performance & assets

## Le problème historique : latence au premier clic

Dans la version 2019, les icônes `croix.svg` et `rond.svg` étaient importées comme **URLs** :

```js
import croix from '../../../assets/croix.svg'
// croix === '/static/media/croix.<hash>.svg'

<img src={croix} alt='croix' />
```

Conséquence : le SVG n'était **pas** dans le bundle JS. Le navigateur ne le téléchargeait que la première fois qu'une `<img>` correspondante apparaissait dans le DOM — c'est-à-dire au **premier clic** sur une case. D'où un flash blanc visible de quelques centaines de ms.

## La solution actuelle : svgr + import `?react`

`vite-plugin-svgr` transforme un import suffixé `?react` en composant React inliné dans le JS :

```tsx
import Croix from '../../../assets/croix.svg?react'

<Croix className='player2-img' />
```

Au build, le contenu de `croix.svg` (balises `<svg>`, `<path>`, etc.) est compilé directement dans `dist/assets/index-<hash>.js`. **Zéro requête réseau** au runtime — l'icône s'affiche à la frame suivante.

## Vérification

Après `npm run build`, le dossier `dist/assets/` ne contient **aucun** fichier `.svg` :

```bash
$ ls dist/assets/
index-<hash>.css
index-<hash>.js
papier-ancien-<hash>.jpg
```

Et un grep dans le bundle retrouve les 3 viewBox (logo, croix, rond) :

```bash
$ grep -o 'viewBox:"[^"]*"' dist/assets/index-*.js
viewBox:"0 0 804 221"   # tic-tac-toe.svg (logo)
viewBox:"0 0 800 600"   # croix.svg
viewBox:"0 0 800 600"   # rond.svg
```

## Trade-off

| | URL import (avant) | svgr `?react` (maintenant) |
|---|---|---|
| Taille du JS initial | + faible | + élevée (de quelques KB par SVG) |
| Requêtes réseau au runtime | 1 par SVG, à la demande | 0 |
| Latence au premier rendu d'une icône | visible | imperceptible |
| Caching navigateur | possible (URL stable) | inutile (inlinée) |

Pour des icônes petites et **immédiatement utilisées**, l'inlining est gagnant. Pour des assets lourds et rarement vus, garder un import URL est plus économe.

## Configuration

Dans `vite.config.ts` :

```ts
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()]
})
```

Et dans `src/vite-env.d.ts`, la directive triple-slash qui rend le suffixe `?react` typé :

```ts
/// <reference types='vite/client' />
/// <reference types='vite-plugin-svgr/client' />
```

Sans cette ligne, TypeScript refuserait l'import `?react`.

## Autres assets

| Asset | Stratégie |
|---|---|
| `papier-ancien.jpg` (fond) | Référencé en CSS via `background-image: url(...)`. Vite l'extrait et le hash, le sert depuis `dist/assets/`. |
| `favicon.ico` | Dans `public/`, copié tel quel à la racine du build (référencé `<link rel='icon' href='/favicon.ico'>`). |

## Pistes d'optimisation futures

- Code-splitting par route via `React.lazy` + `Suspense` — pour ce projet de 2 pages, le gain serait négligeable (le bundle complet fait ~370 KB / 176 KB gzippé).
- Compression des SVG via `svgo` (intégré à svgr) — possible mais probablement déjà fait par les outils d'export originaux ; à mesurer.
- Préchargement de la police système / réduction du LCP : non pertinent ici, le rendu initial est déjà sous 100 ms en local.
