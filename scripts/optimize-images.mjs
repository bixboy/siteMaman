// Optimise les images de resources/ : WebP, plus grand côté ≤ 1600 px, noms en minuscules
// sans espaces ni accents. Met à jour les chemins dans les fichiers HTML/CSS/JS/XML.
// Usage : npm run images (sans effet sur une image déjà conforme)
import { execFileSync } from 'node:child_process';
import { readdir, readFile, rename, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(import.meta.dirname, '..');
const MAX_SIDE = 1600;
const QUALITY = 75;
const IMAGE_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const TEXT_EXT = new Set(['.html', '.css', '.js', '.xml']);
const SKIP_DIRS = new Set(['.git', 'node_modules', 'scripts']);

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const toUrl = (file) => path.relative(ROOT, file).split(path.sep).join('/');

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
  for await (const file of walk(ROOT)) {
    if (!TEXT_EXT.has(path.extname(file))) continue;
    const original = await readFile(file, 'utf8');
    let content = original;
    for (const { from, to } of renames) content = content.replaceAll(toUrl(from), toUrl(to));
    if (content !== original) await writeFile(file, content);
  }
}

const results = [];
try {
  for await (const file of walk(path.join(ROOT, 'resources'))) {
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
  fichier: toUrl(to), avant_ko: ko(before), apres_ko: ko(after),
  ...(from !== to && { ancien_nom: path.basename(from) }),
})));
const total = (key) => ko(results.reduce((sum, r) => sum + r[key], 0));
console.log(`${results.length} image(s) : ${total('before')} Ko → ${total('after')} Ko`);
