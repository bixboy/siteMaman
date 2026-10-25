// Outils communs aux tests : serveur statique et lancement de Chrome
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain',
};

const CHROME_PATHS = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].filter(Boolean);

// Serveur statique minimal, comme OVH : « / » → index.html, sinon 404
export async function serve(root) {
  const server = createServer(async (req, res) => {
    const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const file = path.join(root, url.endsWith('/') ? `${url}index.html` : url);
    try {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404).end();
    }
  });
  await new Promise((resolve) => server.listen(0, resolve));
  return { url: `http://localhost:${server.address().port}`, close: () => server.close() };
}

// Chrome installé sur la machine (variable CHROME_PATH ou emplacement habituel)
export function launchChrome() {
  return puppeteer.launch({
    executablePath: CHROME_PATHS.find((p) => existsSync(p)),
    // Les runners Ubuntu de GitHub interdisent le bac à sable de Chrome
    args: process.env.CI ? ['--no-sandbox'] : [],
  });
}
