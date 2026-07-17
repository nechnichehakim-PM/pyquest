# PyQuest — instructions projet

Jeu RPG en français pour apprendre Python, en ligne sur
**https://nechnichehakim-pm.github.io/pyquest/** (GitHub Pages, repo `nechnichehakim-PM/pyquest`,
déploiement automatique à chaque push sur `main`). Comptes joueurs et classement via Supabase
(projet `fpgooehdjbpchkewuopb`, config dans `config.js`).

## Quand l'utilisateur dit « génère l'acte de la semaine » (ou équivalent)

Suivre EXACTEMENT `tools/ROUTINE.md` :
1. Lire `tools/ROUTINE.md` en entier (format, feuille de route des thèmes, sous-ensemble Python supporté)
2. Lire `content/extensions.js` : repérer le dernier acte et sa date `dispo`
3. Ajouter UN acte (2 chapitres : 3 dalles + 1 projet chacun) à la fin de `content/extensions.js`,
   `dispo` = le lundi qui suit la dernière date `dispo` existante (le stock peut avoir de l'avance)
4. Valider : `node tools/validate.js` — corriger jusqu'à « 🏆 VALIDATION COMPLÈTE »
5. `git add content/extensions.js && git commit && git push` (gh CLI déjà authentifié sur cette machine)

## Règles

- Ne JAMAIS pousser sans validation complète.
- Ne modifier QUE `content/extensions.js` pour du nouveau contenu.
- Toute solution de défi doit rester dans le sous-ensemble Python du mini-interpréteur
  (documenté dans `tools/ROUTINE.md`) — pas d'import, pas de tuple-unpacking, pas de ternaire,
  pas de `ord/chr`, clés de dict = chaînes uniquement dans les tests.
- Contenu 100 % français, tutoiement, univers RPG cohérent avec les actes existants.
- `.dbpass.txt` (mot de passe base de données) ne doit jamais être commité (déjà dans .gitignore).
