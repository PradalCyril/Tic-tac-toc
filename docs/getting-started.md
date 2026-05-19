# Démarrage rapide

## Prérequis

- **Node.js** ≥ 20 (recommandé : Node LTS courant)
- **npm** ≥ 10 (livré avec Node)

Aucune autre dépendance système (pas de Docker, pas de base de données).

## Installation

```bash
git clone <url-du-repo>
cd Tic-tac-toc
git checkout modernize          # branche avec la stack à jour
npm install
```

## Scripts disponibles

Définis dans `package.json` :

| Commande | Effet |
|---|---|
| `npm run dev` | Lance Vite en mode dev (HMR, port 5173 par défaut, ou 5174+ si occupé). |
| `npm run build` | Type-check (`tsc -b`) puis build de production dans `dist/`. |
| `npm run preview` | Sert localement le build de `dist/` (utile pour vérifier le bundle avant déploiement). |
| `npm run lint` | Type-check seul, sans émettre de fichiers. |

## Workflow typique

```bash
npm run dev                     # développement
# ... éditer du code, Vite recharge à chaud ...
npm run lint                    # vérifier que TypeScript est content
npm run build                   # vérifier le bundle de production
npm run preview                 # tester le build localement
```

## Branches Git

| Branche | Rôle |
|---|---|
| `master` | Code historique de 2019 (React 16 + CRA), toujours déployé sur Netlify. |
| `dev` | Idem `master`, branche de travail de l'époque. |
| `modernize` | Stack actuelle (React 19 + Vite + TS). À merger vers `master` quand validé. |
| `mobile` | Ancienne variante mobile, non maintenue. |

## Ports & URLs en local

- Dev : <http://localhost:5173/> (Vite essaie 5174, 5175... si le port est pris)
- Preview : <http://localhost:4173/>

## Variables d'environnement

Aucune. Le jeu est 100 % côté client.
