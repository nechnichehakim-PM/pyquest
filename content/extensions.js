/* ============================================================
   PyQuest — extensions hebdomadaires.
   L'agent ajoute chaque semaine UN bloc PYQUEST_EXTENSIONS.push({...})
   À LA FIN de ce fichier, sans toucher aux blocs précédents.
   Format d'un bloc : voir le premier bloc ci-dessous (modèle canonique).
   Valider avec :  node tools/validate.js
   ============================================================ */
window.PYQUEST_EXTENSIONS = window.PYQUEST_EXTENSIONS || [];

/* ============ SEMAINE DU 2026-07-20 — Acte IV ============ */
window.PYQUEST_EXTENSIONS.push({
 dispo:'2026-07-20',
 name:'Acte IV — Les Marais de la Mémoire',sub:'Semaine 4 · compter, fusionner, quadriller',dmg:24,xp:25,tick:10,
 chapters:[
 {jour:'Semaine 4',emoji:'🐸',name:'Le Crapaud Compteur',mini:'dictionnaires de comptage',
  desc:'Il compte tout ce qui bouge dans le marais. Le pattern de comptage est PARTOUT dans le vrai code.',
  challenges:[
   {title:'Le comptage',
    lesson:'<p>LE pattern à connaître : compter les occurrences avec un dictionnaire. <code>d.get(x, 0)</code> renvoie 0 si la clé n’existe pas encore :</p><pre>d[x] = d.get(x, 0) + 1</pre>',
    task:'<b>Mission :</b> écris <code>compter(liste)</code> qui renvoie un dictionnaire {élément: nombre d’apparitions}.',
    starter:'def compter(liste):\n    ',
    hints:['Commence avec d = {} puis boucle sur la liste.','À chaque tour : d[x] = d.get(x, 0) + 1 — puis return d.'],
    solution:'def compter(liste):\n    d = {}\n    for x in liste:\n        d[x] = d.get(x, 0) + 1\n    return d',
    tests:[{call:{fn:'compter',args:[['a','b','a']],want:{__dict__:{a:2,b:1}}}},{call:{fn:'compter',args:[[]],want:{__dict__:{}}}},{call:{fn:'compter',args:[['ver','ver','ver']],want:{__dict__:{ver:3}}}}]},
   {title:'Le plus fréquent',
    lesson:'<p>Pour trouver la clé qui a la plus grande valeur, on parcourt les paires avec <code>d.items()</code> :</p><pre>for cle, valeur in d.items():</pre><p>et on garde un champion, comme d’habitude.</p>',
    task:'<b>Mission :</b> écris <code>plus_frequent(d)</code> qui renvoie la CLÉ dont la valeur est la plus grande (d n’est jamais vide).',
    starter:'def plus_frequent(d):\n    ',
    hints:['meilleur = None et haut = -1 avant la boucle.','for cle, valeur in d.items(): — si valeur > haut, mets à jour les deux.'],
    solution:'def plus_frequent(d):\n    meilleur = None\n    haut = -1\n    for cle, valeur in d.items():\n        if valeur > haut:\n            haut = valeur\n            meilleur = cle\n    return meilleur',
    tests:[{call:{fn:'plus_frequent',args:[{__dict__:{a:2,b:5}}],want:'b'}},{call:{fn:'plus_frequent',args:[{__dict__:{x:1}}],want:'x'}}]},
   {title:'La fusion des inventaires',
    lesson:'<p>Fusionner deux dictionnaires de comptage : on verse le second dans le premier en ADDITIONNANT les valeurs — encore le pattern <code>get(cle, 0)</code>.</p>',
    task:'<b>Mission :</b> écris <code>fusionner(d1, d2)</code> qui ajoute chaque paire de d2 dans d1 (en additionnant si la clé existe déjà) et renvoie d1.',
    starter:'def fusionner(d1, d2):\n    ',
    hints:['for cle, valeur in d2.items():','d1[cle] = d1.get(cle, 0) + valeur — puis return d1 après la boucle.'],
    solution:'def fusionner(d1, d2):\n    for cle, valeur in d2.items():\n        d1[cle] = d1.get(cle, 0) + valeur\n    return d1',
    tests:[{call:{fn:'fusionner',args:[{__dict__:{or:2}},{__dict__:{or:3,bois:1}}],want:{__dict__:{or:5,bois:1}}}},{call:{fn:'fusionner',args:[{__dict__:{}},{__dict__:{a:1}}],want:{__dict__:{a:1}}}}]}],
  projet:{title:'PROJET · Le recensement du marais',
    lesson:'<p>🏗️ <b>Grand Projet !</b> Le Crapaud exige le recensement complet : compter les créatures PUIS produire un rapport trié — les deux patterns du chapitre bout à bout.</p>',
    task:'<b>Mission :</b> écris <code>recensement(creatures)</code> (liste → dictionnaire de comptage) et <code>rapport(d)</code> qui renvoie la liste des lignes <code>nom x N</code>, triées par nom (parcours <code>sorted(d.keys())</code>).',
    starter:'def recensement(creatures):\n    \n\ndef rapport(d):\n    ',
    hints:['recensement : le pattern d[x] = d.get(x, 0) + 1.','rapport : lignes = [] puis for nom in sorted(d.keys()): lignes.append(f"{nom} x {d[nom]}")'],
    solution:'def recensement(creatures):\n    d = {}\n    for x in creatures:\n        d[x] = d.get(x, 0) + 1\n    return d\n\ndef rapport(d):\n    lignes = []\n    for nom in sorted(d.keys()):\n        lignes.append(f"{nom} x {d[nom]}")\n    return lignes',
    tests:[{call:{fn:'recensement',args:[['grenouille','moustique','grenouille']],want:{__dict__:{grenouille:2,moustique:1}}}},{call:{fn:'rapport',args:[{__dict__:{moustique:3,grenouille:2}}],want:['grenouille x 2','moustique x 3']}},{hidden:true,call:{fn:'rapport',args:[{__dict__:{}}],want:[]}},{hidden:true,call:{fn:'recensement',args:[[]],want:{__dict__:{}}}}]}},
 {jour:'Semaine 4',emoji:'🦉',name:'La Chouette des Matrices',mini:'listes de listes',
  desc:'Elle voit le monde en grilles : plateaux de jeu, images, tableaux — tout est liste de listes.',
  challenges:[
   {title:'La grille',
    lesson:'<p>Une <b>liste de listes</b> représente une grille : <code>grille[ligne][colonne]</code>.</p><pre>g = [[1, 2], [3, 4]]\ng[1][0]   # 3 (ligne 1, colonne 0)</pre>',
    task:'<b>Mission :</b> écris <code>case(grille, ligne, col)</code> qui renvoie la valeur à cette position.',
    starter:'def case(grille, ligne, col):\n    ',
    hints:['Deux paires de crochets à la suite.','return grille[ligne][col]'],
    solution:'def case(grille, ligne, col):\n    return grille[ligne][col]',
    tests:[{call:{fn:'case',args:[[[1,2],[3,4]],1,0],want:3}},{call:{fn:'case',args:[[['x']],0,0],want:'x'}}]},
   {title:'La somme du plateau',
    lesson:'<p>Pour visiter TOUTES les cases : une boucle dans une boucle.</p><pre>for ligne in grille:\n    for valeur in ligne:\n        ...</pre>',
    task:'<b>Mission :</b> écris <code>somme_grille(grille)</code> qui renvoie la somme de toutes les cases, avec une double boucle (sum() interdit).',
    starter:'def somme_grille(grille):\n    ',forbid:['sum'],
    hints:['total = 0 avant les boucles.','for ligne in grille: puis for v in ligne: total = total + v'],
    solution:'def somme_grille(grille):\n    total = 0\n    for ligne in grille:\n        for v in ligne:\n            total = total + v\n    return total',
    tests:[{call:{fn:'somme_grille',args:[[[1,2],[3,4]]],want:10}},{call:{fn:'somme_grille',args:[[[5]]],want:5}},{call:{fn:'somme_grille',args:[[[]]],want:0}}]},
   {title:'La diagonale',
    lesson:'<p>La diagonale d’une grille carrée : la case <code>[i][i]</code> pour chaque i. Avec <code>range(len(grille))</code> tu obtiens tous les indices.</p>',
    task:'<b>Mission :</b> écris <code>diagonale(grille)</code> qui renvoie la liste des cases [0][0], [1][1], [2][2]…',
    starter:'def diagonale(grille):\n    ',
    hints:['Une compréhension fait tout : [... for i in range(len(grille))]','return [grille[i][i] for i in range(len(grille))]'],
    solution:'def diagonale(grille):\n    return [grille[i][i] for i in range(len(grille))]',
    tests:[{call:{fn:'diagonale',args:[[[1,2],[3,4]]],want:[1,4]}},{call:{fn:'diagonale',args:[[[7]]],want:[7]}},{call:{fn:'diagonale',args:[[]],want:[]}}]}],
  projet:{title:'PROJET · La carte au trésor',
    lesson:'<p>🏗️ <b>Grand Projet !</b> La Chouette a caché un trésor dans sa grille. Il faut le LOCALISER : parcourir avec les INDICES (<code>range(len(...))</code>) pour renvoyer la position, pas la valeur.</p>',
    task:'<b>Mission :</b> écris <code>chercher(grille, tresor)</code> qui renvoie la position <code>[ligne, colonne]</code> de la première apparition du trésor, ou <code>[-1, -1]</code> s’il est absent.',
    starter:'def chercher(grille, tresor):\n    ',
    hints:['for i in range(len(grille)): puis for j in range(len(grille[i])):','if grille[i][j] == tresor: return [i, j] — et [-1, -1] tout à la fin.'],
    solution:'def chercher(grille, tresor):\n    for i in range(len(grille)):\n        for j in range(len(grille[i])):\n            if grille[i][j] == tresor:\n                return [i, j]\n    return [-1, -1]',
    tests:[{call:{fn:'chercher',args:[[['.','.'],['.','X']],'X'],want:[1,1]}},{call:{fn:'chercher',args:[[['.','.']],'X'],want:[-1,-1]}},{hidden:true,call:{fn:'chercher',args:[[['X']],'X'],want:[0,0]}},{hidden:true,call:{fn:'chercher',args:[[],'X'],want:[-1,-1]}}]}}
]});
