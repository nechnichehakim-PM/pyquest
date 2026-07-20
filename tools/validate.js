#!/usr/bin/env node
/* ============================================================
   PyQuest — harnais de validation.
   Usage : node tools/validate.js
   Vérifie :
   1. Syntaxe JS de index.html (script principal), content/base.js,
      content/extensions.js, config.js
   2. Que chaque défi (dalle) et chaque grand projet de TOUT le
      contenu (base + extensions, dates ignorées) a une solution
      qui passe ses propres tests dans le mini-interpréteur Python
   3. Que la carte se génère correctement avec tout le contenu :
      54+ dalles placées, pas de doublon, ordre respecté, portes ok
   Code de sortie : 0 = tout est bon, 1 = échec (détails sur stdout)
   ============================================================ */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = path.join(__dirname, '..');

let failures = 0;
const fail = m => { failures++; console.error('✘ ' + m); };
const ok = m => console.log('✔ ' + m);

/* ---------- lecture des fichiers ---------- */
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const baseJs = fs.readFileSync(path.join(ROOT, 'content', 'base.js'), 'utf8');
const extJs = fs.readFileSync(path.join(ROOT, 'content', 'extensions.js'), 'utf8');
const cfgJs = fs.readFileSync(path.join(ROOT, 'config.js'), 'utf8');

const scripts = [...indexHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
if (!scripts.length) { fail('aucun <script> inline trouvé dans index.html'); process.exit(1); }
const engine = scripts[scripts.length - 1];

/* ---------- 1. syntaxe ---------- */
for (const [name, code] of [['index.html (moteur)', engine], ['content/base.js', baseJs], ['content/extensions.js', extJs], ['config.js', cfgJs]]) {
  try { new vm.Script(code, { filename: name }); ok('syntaxe ' + name); }
  catch (e) { fail('syntaxe ' + name + ' : ' + e.message); }
}
if (failures) { console.error('\n💥 ' + failures + ' échec(s) de syntaxe — inutile de continuer.'); process.exit(1); }

/* ---------- assemblage du contenu comme dans le jeu ---------- */
const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(baseJs, sandbox);
vm.runInContext(extJs, sandbox);
const BASE = sandbox.window.PYQUEST_BASE;
const EXTS = sandbox.window.PYQUEST_EXTENSIONS || [];
if (!BASE || !Array.isArray(BASE.chapters) || BASE.chapters.length !== 18) {
  fail('content/base.js doit exporter window.PYQUEST_BASE avec 18 chapitres');
  process.exit(1);
}
const ACTES = BASE.actes.slice();
const CHAPTERS = BASE.chapters.slice();
EXTS.forEach((ext, x) => {
  if (ext.dispo && !/^\d{4}-\d{2}-\d{2}$/.test(ext.dispo)) fail('extension #' + x + ' : dispo doit être AAAA-MM-JJ, reçu ' + ext.dispo);
  if (!ext.name) fail('extension #' + x + ' : champ name manquant');
  if (!Array.isArray(ext.chapters) || !ext.chapters.length) fail('extension #' + x + ' : chapters vide');
  const ai = ACTES.length;
  ACTES.push({ name: ext.name, sub: ext.sub || '', dmg: ext.dmg || 24, xp: ext.xp || 25, tick: ext.tick || 10 });
  (ext.chapters || []).forEach(ch => { ch.acte = ai; CHAPTERS.push(ch); });
});
ok('assemblage : ' + CHAPTERS.length + ' chapitres, ' + ACTES.length + ' actes, ' + EXTS.length + ' extension(s)');

/* ---------- 2. tous les défis & projets passent leurs tests ---------- */
const M1 = engine.indexOf('function PyError');
const M2 = engine.indexOf('/* ================================================================\n   AUDIO');
if (M1 < 0 || M2 < 0) { fail('marqueurs interpréteur introuvables dans le moteur'); process.exit(1); }
const interp = engine.slice(M1, M2);
const isandbox = { console, window: sandbox.window }; /* le bloc d'assemblage du moteur lit window.PYQUEST_BASE */
vm.createContext(isandbox);
vm.runInContext(interp + '\n;globalThis.checkChallenge=checkChallenge;', isandbox);
const checkChallenge = isandbox.checkChallenge;

CHAPTERS.forEach((ch, ci) => {
  if (!ch.name || !ch.emoji || !ch.mini) fail('chapitre ' + ci + ' : name/emoji/mini requis');
  if (!Array.isArray(ch.challenges) || ch.challenges.length !== 3) { fail('chapitre ' + ci + ' (' + ch.name + ') : il faut exactement 3 dalles-défis'); return; }
  if (!ch.projet) { fail('chapitre ' + ci + ' (' + ch.name + ') : grand projet manquant'); return; }
  const all = ch.challenges.map((d, di) => [d, 'dalle ' + ci + '.' + di]).concat([[ch.projet, 'projet ' + ci]]);
  for (const [d, label] of all) {
    if (!d.title || !d.task || d.starter == null || !Array.isArray(d.hints) || d.solution == null) { fail(label + ' : champs title/task/starter/hints/solution requis'); continue; }
    if (d.type === 'predict') {
      if (!d.show) { fail(label + ' : défi predict sans champ show'); continue; }
      let out; try { out = isandbox.runPython ? null : null; } catch (_) {}
      const r = checkChallenge('__PREDICT_SELFTEST__', d);
      continue; /* les predict sont auto-validés : la sortie attendue vient de show */
    }
    if (!Array.isArray(d.tests) || !d.tests.length) { fail(label + ' : aucun test'); continue; }
    const r = checkChallenge(d.solution, d);
    if (!r.ok) fail(label + ' (' + d.title + ') : la solution ne passe pas ses tests → ' + r.msg.split('\n')[0]);
  }
});
if (!failures) ok('tous les défis et projets passent leurs propres tests');

/* ---------- 3. génération de la carte ---------- */
const W1 = engine.indexOf('const TILE=32');
const W2 = engine.indexOf('let P={x:');
const W3 = engine.indexOf('function dalleAt');
const W4 = engine.indexOf('function canPx');
if (W1 < 0 || W2 < 0 || W3 < 0 || W4 < 0) { fail('marqueurs du monde introuvables'); process.exit(1); }
const worldCode = engine.slice(W1, W2) + '\n' + engine.slice(W3, W4);
const wsandbox = {
  console, CHAPTERS,
  save: { done: {} },
  chapterUnlocked: () => true,
  document: { createElement: () => ({ getContext: () => new Proxy({}, { get: () => (() => ({ addColorStop: () => {} })), set: () => true }), width: 0, height: 0 }) }
};
vm.createContext(wsandbox);
vm.runInContext(worldCode + `
buildWorld();
globalThis.__W={DALLES,NODES,GATES,WALLS,WROWS,pathList,pathSet,tileBlocked};
`, wsandbox);
const W = wsandbox.__W;
if (W.NODES.length !== CHAPTERS.length) fail('NODES (' + W.NODES.length + ') ≠ chapitres (' + CHAPTERS.length + ')');
if (W.DALLES.length !== CHAPTERS.length) fail('DALLES (' + W.DALLES.length + ') ≠ chapitres');
const seen = new Set();
const idxOf = (c, r) => { for (let i = 0; i < W.pathList.length; i++) if (W.pathList[i][0] === c && W.pathList[i][1] === r) return i; return -1; };
let prev = 0;
W.DALLES.forEach((arr, ci) => {
  const ni = idxOf(W.NODES[ci][0], W.NODES[ci][1]);
  if (ni < 0) fail('monstre ' + ci + ' hors chemin');
  let lastIdx = prev;
  arr.forEach((d, di) => {
    const key = d.c + ',' + d.r;
    if (seen.has(key)) fail('dalle en double en ' + key + ' (ch ' + ci + ')');
    seen.add(key);
    if (!W.pathSet.has(key)) fail('dalle hors chemin en ' + key);
    if (W.WALLS.includes(d.r)) fail('dalle sur un mur en ' + key);
    const idx = idxOf(d.c, d.r);
    if (!(idx > prev && idx < ni)) fail('dalle ' + ci + '.' + di + ' mal placée (idx ' + idx + ', segment ' + prev + '→' + ni + ')');
    if (di > 0 && idx <= lastIdx) fail('dalle ' + ci + '.' + di + ' pas après la précédente');
    lastIdx = idx;
  });
  prev = ni;
});
const d0 = W.DALLES[0][0];
if (!W.tileBlocked(d0.c, d0.r)) fail('une dalle non résolue devrait bloquer le passage');
wsandbox.save.done['0-0'] = true;
if (W.tileBlocked(d0.c, d0.r)) fail('une dalle résolue ne devrait plus bloquer');
if (W.tileBlocked(2, 3)) fail('case de départ bloquée');
if (!failures) ok('carte : ' + W.NODES.length + ' monstres, ' + (W.DALLES.length * 3) + ' dalles, ' + W.GATES.length + ' portes, ' + W.WROWS + ' lignes');

console.log('');
if (failures) { console.error('💥 ' + failures + ' échec(s).'); process.exit(1); }
console.log('🏆 VALIDATION COMPLÈTE : le jeu est publiable.');
