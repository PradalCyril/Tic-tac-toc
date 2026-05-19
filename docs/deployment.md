# Déploiement

## Situation actuelle

Le site est hébergé sur **Netlify** depuis 2019 : <https://modest-benz-601a77.netlify.app/>

À l'époque, il était déployé depuis la branche `master` avec :

- Build command : `npm run build`
- Publish directory : `build/`  ← convention Create React App

## Changement requis pour la version modernisée

Vite produit le build dans `dist/`, pas `build/`. Quand la branche `modernize` sera mergée vers `master`, il faudra mettre à jour le réglage Netlify :

| Réglage | Avant (CRA) | Après (Vite) |
|---|---|---|
| Build command | `npm run build` | `npm run build` (inchangé) |
| Publish directory | `build` | `dist` |
| Node version | (auto) | 20 ou plus récent |

### Via l'UI Netlify

1. Site settings → Build & deploy → Build settings → Edit settings.
2. Remplacer `build` par `dist` dans Publish directory.
3. Save.
4. Trigger deploy → Deploy site.

### Via `netlify.toml` (recommandé, versionné)

Créer un fichier `netlify.toml` à la racine :

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Le redirect `/*` → `/index.html` est nécessaire pour que les routes côté client (`/play/:name1/:name2`) fonctionnent en lien direct ou après rafraîchissement de la page.

## SPA et routing côté client

`react-router` gère les URLs côté navigateur. Sans la règle de redirect, accéder directement à `https://<site>/play/Alice/Bob` renverrait un 404 Netlify : le fichier `play/Alice/Bob/index.html` n'existe pas. La règle catch-all sert toujours `index.html`, qui charge React, qui résout l'URL.

## Alternatives

| Plateforme | Adapté ? |
|---|---|
| **Netlify** | Oui, déjà en place. Garder l'URL actuelle. |
| **Vercel** | Oui, configuration équivalente (`vercel.json` avec `rewrites: [{ source: "/(.*)", destination: "/index.html" }]`). À envisager si tu centralises la suite LBR sur Vercel. |
| **GitHub Pages** | Possible mais moins pratique (besoin de `base` dans `vite.config.ts` et configuration manuelle du fallback). |
| **Cloudflare Pages** | Identique à Netlify en complexité, plus rapide en edge. |

## Build local de production

Pour reproduire le build qui sera déployé :

```bash
npm run build       # génère dist/
npm run preview     # sert dist/ sur http://localhost:4173
```

Le `preview` est utile pour vérifier les routes en mode statique avant de pousser.
