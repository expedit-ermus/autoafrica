/**
 * scripts/check-bundle-budget.mjs
 * ──────────────────────────────────────────────────────────
 * Verifie les budgets de bundle definis dans `docs/21-PERFORMANCE.md` :
 * JS total < 200 Ko, JS propre a la page < 80 Ko, CSS < 50 Ko (gzip), par route.
 * Le JS propre a la page est obtenu en retranchant le socle commun, defini
 * comme l ensemble des chunks charges par toutes les routes sans exception.
 *
 * Le build Turbopack de Next 16 n'imprime plus de tableau de tailles. La mesure
 * est donc lue sur la sortie reelle : chaque page prerendue dans
 * `.next/server/app/**\/*.html` reference ses propres fichiers statiques, ce
 * qui donne le first-load exact de la route. Les fichiers sont dedupliques par
 * route puis compresses en gzip pour etre compares aux budgets.
 *
 * Limite assumee : seules les routes prerendues (`○`) produisent un HTML. Les
 * routes dynamiques (`ƒ`) ne sont pas mesurees ici ; elles partagent toutefois
 * le socle commun, reporte en fin de rapport.
 *
 * Usage : npm run check:budget  (echoue si un budget est depasse)
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { join, relative, sep } from 'node:path';

const NEXT_DIR = '.next';
const APP_DIR = join(NEXT_DIR, 'server', 'app');
const BUDGETS = { js: 200 * 1024, pageJs: 80 * 1024, css: 50 * 1024 };

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Taille gzip d'un actif statique, mise en cache entre les routes. */
const gzipCache = new Map();
function gzipSize(assetPath) {
  if (gzipCache.has(assetPath)) return gzipCache.get(assetPath);
  const onDisk = join(NEXT_DIR, assetPath.replace('/_next/', ''));
  let size = 0;
  if (existsSync(onDisk)) size = gzipSync(readFileSync(onDisk)).length;
  gzipCache.set(assetPath, size);
  return size;
}

/**
 * Scripts reellement charges par un navigateur moderne : les balises marquees
 * `noModule` (bundle de polyfills legacy, ~39 Ko gzip) ne sont jamais
 * telechargees par les cibles de `21-PERFORMANCE.md` et sont donc exclues.
 */
function scriptsOf(html) {
  const found = new Set();
  for (const [tag] of html.matchAll(/<script\b[^>]*>/g)) {
    if (/\bnoModule\b/i.test(tag)) continue;
    const src = tag.match(/src="(\/_next\/static\/[^"]+\.js)"/);
    if (src) found.add(src[1]);
  }
  return [...found];
}

function stylesheetsOf(html) {
  const pattern = /\/_next\/static\/[^"']+\.css/g;
  return [...new Set(html.match(pattern) ?? [])];
}

function kb(bytes) {
  return `${(bytes / 1024).toFixed(1)} Ko`;
}

if (!existsSync(APP_DIR)) {
  console.error('Aucune sortie de build trouvee. Lancer `npm run build` d\'abord.');
  process.exit(1);
}

const pages = [];
for (const file of walk(APP_DIR)) {
  const html = readFileSync(file, 'utf8');
  const route = '/' + relative(APP_DIR, file).replace(/\.html$/, '').split(sep).join('/');
  pages.push({
    route: route === '/index' ? '/' : route,
    scripts: scriptsOf(html),
    styles: stylesheetsOf(html),
  });
}

/** Socle commun : les chunks charges par toutes les routes sans exception. */
const shared = pages
  .map((p) => new Set(p.scripts))
  .reduce((acc, set) => new Set([...acc].filter((chunk) => set.has(chunk))));
const sharedBytes = [...shared].reduce((total, asset) => total + gzipSize(asset), 0);

const sum = (assets) => assets.reduce((total, asset) => total + gzipSize(asset), 0);
const rows = pages
  .map((p) => ({
    route: p.route,
    js: sum(p.scripts),
    pageJs: sum(p.scripts.filter((chunk) => !shared.has(chunk))),
    css: sum(p.styles),
  }))
  .sort((a, b) => b.js - a.js);

const over = rows.filter((r) => r.js > BUDGETS.js || r.css > BUDGETS.css || r.pageJs > BUDGETS.pageJs);
const width = Math.max(...rows.map((r) => r.route.length), 10);

console.log(`\nBudgets 21-PERFORMANCE.md — JS total < ${kb(BUDGETS.js)}, JS par page < ${kb(BUDGETS.pageJs)}, CSS < ${kb(BUDGETS.css)} (gzip)`);
console.log(`${rows.length} routes prerendues mesurees — socle commun : ${kb(sharedBytes)}\n`);
console.log(`${'Route'.padEnd(width)}  ${'JS total'.padStart(10)}  ${'JS page'.padStart(10)}  ${'CSS'.padStart(10)}`);
console.log('-'.repeat(width + 36));
for (const r of rows) {
  const exceeded = r.js > BUDGETS.js || r.css > BUDGETS.css || r.pageJs > BUDGETS.pageJs;
  console.log(
    `${r.route.padEnd(width)}  ${kb(r.js).padStart(10)}  ${kb(r.pageJs).padStart(10)}  ${kb(r.css).padStart(10)}${exceeded ? '  DEPASSE' : ''}`,
  );
}

const worst = rows[0];
console.log(`\nRoute la plus lourde : ${worst.route} — ${kb(worst.js)} de JS gzip (dont ${kb(worst.pageJs)} propres a la route).`);

if (over.length > 0) {
  console.error(`\n${over.length} route(s) hors budget.`);
  process.exit(1);
}
console.log('\nTous les budgets sont respectes.');
