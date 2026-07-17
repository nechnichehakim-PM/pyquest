# ⚔ PyQuest — De Nul à Expert en Python

Un RPG dans le navigateur pour apprendre Python : le héros avance sur un chemin de
**dalles-défis 💠** (chaque dalle = un vrai défi de code exécuté dans le jeu) et chaque
**monstre garde un GRAND PROJET 🏗️** qui assemble tout le chapitre. Comptes joueurs,
progression en ligne, classement entre amis, et **le monde s'agrandit chaque semaine**.

## Structure

| Fichier | Rôle |
|---|---|
| `index.html` | Le moteur complet : interpréteur Python pédagogique, carte 2D, combats, comptes |
| `content/base.js` | Le contenu de base : 3 actes, 18 chapitres (54 dalles + 18 projets) |
| `content/extensions.js` | Les actes hebdomadaires — l'agent ajoute un bloc par semaine |
| `config.js` | Clés Supabase (comptes en ligne). Vide = mode invité, sauvegarde locale |
| `supabase.sql` | Schéma à coller une fois dans le SQL Editor de Supabase |
| `tools/validate.js` | `node tools/validate.js` — vérifie tout avant publication |
| `tools/ROUTINE.md` | Les instructions de l'agent hebdomadaire |

## Mise en ligne (GitHub Pages)

1. Pousser ce dossier dans un repo GitHub.
2. Repo → Settings → Pages → Source : `Deploy from a branch`, branche `main`, dossier `/ (root)`.
3. Le jeu est servi sur `https://<pseudo>.github.io/<repo>/`.

## Comptes en ligne (Supabase)

1. Créer un projet gratuit sur [supabase.com](https://supabase.com).
2. SQL Editor → coller le contenu de `supabase.sql` → Run.
3. Authentication → Sign In / Providers → Email : **désactiver « Confirm email »**
   (sinon chaque pote devra cliquer un lien de confirmation).
4. Settings → API : copier `Project URL` et `anon public key` dans `config.js`.

## Expansion hebdomadaire

Le jeu débloque automatiquement chaque acte à sa date `dispo` (un lundi) — la carte
s'agrandit d'une bande de 10 lignes avec une nouvelle porte ⛩️. Un stock d'actes
d'avance est maintenu dans `content/extensions.js` (actuellement jusqu'au 2026-08-03).

Pour recharger le stock : ouvrir Claude Code dans ce dossier et dire
**« génère l'acte de la semaine »** — le protocole complet est dans `CLAUDE.md`
et `tools/ROUTINE.md` (génération → validation `node tools/validate.js` → push).

## Développement local

```bash
python -m http.server 8000   # puis http://localhost:8000
node tools/validate.js        # avant tout commit
```
