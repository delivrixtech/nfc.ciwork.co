import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright';

const projectRoot = resolve(import.meta.dirname, '..');
const distRoot = resolve(projectRoot, 'dist');
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.vtt': 'text/vtt; charset=utf-8',
  '.woff2': 'font/woff2',
};

const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
    const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
    let filePath = resolve(distRoot, relativePath);
    if (!filePath.startsWith(`${distRoot}/`) && filePath !== resolve(distRoot, 'index.html')) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if ((await stat(filePath)).isDirectory()) filePath = resolve(filePath, 'index.html');
    const content = await readFile(filePath);
    response.writeHead(200, { 'content-type': mimeTypes[extname(filePath)] ?? 'application/octet-stream' });
    response.end(content);
  } catch {
    response.writeHead(404).end('Not found');
  }
});

await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
const address = server.address();
if (!address || typeof address === 'string') throw new Error('Unable to start the QA server.');
const baseUrl = `http://127.0.0.1:${address.port}`;

const chromeCandidates = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);
const executablePath = chromeCandidates.find((candidate) => existsSync(candidate));

let browser;
let failed = false;
try {
  browser = await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });
  const sitemap = await readFile(resolve(distRoot, 'sitemap.xml'), 'utf8');
  const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
  const responsiveRoutes = ['/', '/services/', '/llc-formation/', '/business-formation/', '/browse-by-state/'];
  const scenarios = [
    ...routes.map((route) => ({ route, scheme: 'light', name: 'desktop', width: 1440, height: 900 })),
    ...responsiveRoutes.flatMap((route) => [
      { route, scheme: 'dark', name: 'mid', width: 992, height: 900 },
      { route, scheme: 'dark', name: 'mobile', width: 390, height: 844 },
    ]),
  ];

  for (const { route, scheme, name, width, height } of scenarios) {
      const context = await browser.newContext({ viewport: { width, height }, colorScheme: scheme });
      const page = await context.newPage();
      await page.route('**/*', (route) => route.request().resourceType() === 'media' ? route.abort() : route.continue());
      await page.goto(new URL(route, baseUrl).href, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 0) {
        failed = true;
        console.error(`[${scheme}/${name}] ${route} horizontal overflow: ${overflow}px`);
      }

      const results = await new AxeBuilder({ page }).analyze();
      if (results.violations.length) {
        failed = true;
        for (const violation of results.violations) {
          const targets = violation.nodes.map((node) => node.target.join(' ')).join(', ');
          console.error(`[${scheme}/${name}] ${route} ${violation.impact ?? 'unknown'} ${violation.id}: ${targets}`);
        }
      } else {
        console.log(`[${scheme}/${name}] ${route} axe: 0 violations; horizontal overflow: 0px`);
      }
      await context.close();
  }
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolveClose) => server.close(resolveClose));
}

if (failed) process.exitCode = 1;
