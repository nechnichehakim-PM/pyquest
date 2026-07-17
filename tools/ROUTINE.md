# Routine hebdomadaire — Générer un nouvel acte PyQuest

Tu es l'agent qui fait grandir PyQuest chaque semaine. Ta mission, à chaque exécution :
ajouter **UN nouvel acte** (2 chapitres) à la fin de `content/extensions.js`, le **valider**,
puis **commit + push** sur `main` (GitHub Pages redéploie tout seul).

## Étapes

1. **Lis** `content/extensions.js` en entier : repère les actes déjà publiés (thèmes, numéro du
   dernier acte, dernière date `dispo`). Lis aussi un chapitre de `content/base.js` pour le ton.
2. **Choisis** le prochain thème dans la feuille de route (ou continue logiquement au-delà) :
   - Acte V : tris à la main (tri par sélection, tri à bulles) + recherche binaire
   - Acte VI : chaînes expertes (palindromes, César/chiffrement, parsing simple)
   - Acte VII : POO avancée (composition, inventaire d'objets, machine à états)
   - Acte VIII : simulation (jeu de la vie simplifié, dés & probabilités à la main)
   - Acte IX : révisions boss rush (défis d'entretien mélangés, tests cachés partout)
   - Ensuite : monte la difficulté, varie les biomes (marais → glace → ciel → abysses…)
3. **Écris** le bloc `window.PYQUEST_EXTENSIONS.push({...})` À LA FIN du fichier,
   sans toucher aux blocs précédents. Prends le premier bloc du fichier comme modèle EXACT.
4. **Valide** : `node tools/validate.js` — corrige et relance jusqu'à `🏆 VALIDATION COMPLÈTE`.
5. **Publie** : `git add content/extensions.js && git commit -m "Acte N — <titre> (semaine du <date>)" && git push`.

## Format d'un acte

```js
window.PYQUEST_EXTENSIONS.push({
 dispo:'AAAA-MM-JJ',        // le LUNDI qui suit aujourd'hui (déblocage automatique)
 name:'Acte N — <Nom du biome>', sub:'Semaine N · <résumé>',
 dmg:24, xp:25, tick:10,    // monte doucement : +1 dmg et +1 xp par acte environ
 chapters:[ /* exactement 2 chapitres */
  {jour:'Semaine N', emoji:'<1 emoji monstre>', name:'<Nom du monstre>', mini:'<concept>',
   desc:'<1 phrase d'ambiance>',
   challenges:[ /* exactement 3 dalles-défis, difficulté croissante */
    {title:'...', lesson:'<p>HTML court avec <code>…</code> et <pre>…</pre></p>',
     task:'<b>Mission :</b> ...', starter:'def ...:\n    ',
     hints:['indice doux','indice quasi-solution'],
     solution:'...',
     tests:[{call:{fn:'...',args:[...],want:...}}, ...]}
   ],
   projet:{ /* 1 grand projet qui assemble les 3 dalles, souvent 2 fonctions */ }}
 ]});
```

Types de défis spéciaux (à doser) : `type:'debug'` (starter = code cassé à réparer),
`type:'predict'` (champ `show` = code à lire, pas de tests), `forbid:['max','.sort']`
(interdits vérifiés dans le code du joueur), tests `{hidden:true,...}` (cas cachés),
et `timed:20` au niveau du CHAPITRE pour un boss chrono.

## ⚠️ Le sous-ensemble Python supporté (mini-interpréteur du jeu)

Toute solution qui sort de ce cadre fera échouer la validation.

**Supporté** : `def` (params par défaut), `return`, `if/elif/else`, `while`, `for x in …`
(et `for a, b in …`), `break/continue/pass`, `class` (héritage simple, PAS de `super()`),
`try/except NomErreur as e`, `raise ValueError("msg")`, f-strings, `+ - * / // % **`,
comparaisons, `and/or/not`, `in / not in`, listes, dictionnaires, compréhensions de liste
`[expr for x in it if cond]`, tranches `[a:b]`, indices négatifs.

**Fonctions intégrées** : `print len range str int float abs round max min sum sorted list type`.
**Méthodes str** : `upper lower replace split strip count join startswith endswith capitalize title find`.
**Méthodes list** : `append pop remove sort reverse count index insert`.
**Méthodes dict** : `get keys values items pop`.

**NON supporté (interdit)** : `import`, tuples `(a, b)` en retour, sets, compréhensions de
dict/set, `lambda`, ternaire `x if c else y`, `super()`, `*args/**kwargs`, affectation multiple
`a, b = …`, `else` sur boucle, générateurs/`yield`, décorateurs, `with`, `input()`.

## Format des tests

- `{call:{fn:'nom',args:[...],want:...}}` — appel de fonction. Les dicts s'écrivent
  `{__dict__:{cle:valeur}}` et les CLÉS SONT FORCÉMENT DES CHAÎNES (jamais de clés numériques).
- `{pre:{x:5},out:['ligne 1','ligne 2']}` — variables pré-injectées + sortie print exacte.
- `{out:[...],vars:{total:125}}` — sortie + valeurs de variables attendues.
- `{callRaises:{fn:'f',args:[...],match:'ValueError'}}` — doit lever une erreur.
- `{hidden:true, call:{...}}` — test caché (message générique en cas d'échec).

## Style

Tout en français, tutoiement, univers RPG cohérent avec les actes précédents.
Les leçons sont courtes et concrètes, les 2 indices vont du doux au quasi-donné,
la difficulté des dalles est croissante, et le projet du monstre assemble
réellement les 3 notions des dalles du chapitre.
