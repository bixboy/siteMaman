// Optimise les images de src/resources/ : WebP, plus grand côté ≤ 1600 px, noms en minuscules
// sans espaces ni accents. Met à jour les chemins dans src/ (gabarits, données YAML, CSS, JS).
// Usage : npm run images (sans effet sur une image déjà conforme)
import { execFileSync } from 'node:child_process';
import { readdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');
const RESOURCES = path.join(SRC, 'resources');
const MAX_SIDE = 1600;
const QUALITY = 75;
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const TEXT_EXT = new Set(['.njk', '.yml', '.html', '.css', '.js']);
const SKIP_DIRS = new Set(['.git', 'node_modules']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const toPosix = (from, file) => path.relative(from, file).split(path.sep).join('/');
const toUrl = (file) => toPosix(ROOT, file);
// Chemin tel qu'écrit dans les gabarits (/resources/<chemin>) et les données YAML (<chemin>)
const toResourcePath = (file) => toPosix(RESOURCES, file);
const escapeRegExp = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function normalizedPath(file) {
  const base = path.basename(file, path.extname(file))
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[\s_]+/g, '-');
  return path.join(path.dirname(file), `${base}.webp`);
}

// git mv garde la casse exacte dans le dépôt (Windows l'ignore, l'hébergement Linux non)
async function move(from, to) {
  try {
    execFileSync('git', ['mv', '-f', toUrl(from), toUrl(to)], { cwd: ROOT, stdio: 'ignore' });
  } catch {
    await rename(from, to);
  }
}

async function optimize(file) {
  const target = normalizedPath(file);
  // Lecture en mémoire : sharp verrouille les fichiers ouverts sous Windows
  const source = await readFile(file);
  const { format, width, height } = await sharp(source).metadata();
  // Une image déjà conforme n'est jamais recompressée (perte de qualité à chaque passe)
  if (file === target && format === 'webp' && Math.max(width, height) <= MAX_SIDE) return null;

  const isCaseOnlyRename = file.toLowerCase() === target.toLowerCase();
  if (file !== target && !isCaseOnlyRename && (await stat(target).catch(() => null))) {
    throw new Error(`${toUrl(target)} existe déjà (source : ${toUrl(file)})`);
  }

  const buffer = await sharp(source)
    .rotate() // applique l'orientation EXIF avant de supprimer les métadonnées
    .resize({ width: MAX_SIDE, height: MAX_SIDE, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6 })
    .toBuffer();

  if (file !== target) await move(file, target);
  await writeFile(target, buffer);
  return { from: file, to: target, before: source.length, after: buffer.length };
}

async function updateReferences(renames) {
  // Chemin complet uniquement : « siege1.jpg » ne doit toucher ni « grand-siege1.jpg »
  // ni « Realisations/siege1.jpg »
  const patterns = renames.map(({ from, to }) => ({
    regex: new RegExp(`(?<=/resources/|^|[\\s"'])${escapeRegExp(toResourcePath(from))}(?=$|[\\s"')\\],])`, 'gm'),
    replacement: toResourcePath(to),
  }));
  for await (const file of walk(SRC)) {
    if (!TEXT_EXT.has(path.extname(file))) continue;
    const original = await readFile(file, 'utf8');
    let content = original;
    for (const { regex, replacement } of patterns) content = content.replace(regex, replacement);
    if (content !== original) await writeFile(file, content);
  }
}

const results = [];
try {
  for await (const file of walk(RESOURCES)) {
    if (!IMAGE_EXT.has(path.extname(file).toLowerCase())) continue;
    const result = await optimize(file);
    if (result) results.push(result);
  }
} finally {
  // Même en cas d'erreur, les images déjà renommées doivent rester référencées
  await updateReferences(results.filter(({ from, to }) => from !== to));
}

const ko = (bytes) => Math.round(bytes / 1024);
console.table(results.map(({ from, to, before, after }) => ({
  fichier: toResourcePath(to), avant_ko: ko(before), apres_ko: ko(after),
  ...(from !== to && { ancien_nom: path.basename(from) }),
})));
const total = (key) => ko(results.reduce((sum, r) => sum + r[key], 0));
console.log(`${results.length} image(s) : ${total('before')} Ko → ${total('after')} Ko`);
