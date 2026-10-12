import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const dist = resolve(root, 'dist');
const origin = new URL('https://nfc.ciwork.co');
const failures = [];

const fail = (path, message) => failures.push(`${path}: ${message}`);
const pageFile = (pathname) => resolve(dist, pathname === '/' ? 'index.html' : `.${pathname}index.html`);
const getAttr = (html, selectorPattern, attribute) => {
  const tag = html.match(selectorPattern)?.[0];
  return tag?.match(new RegExp(`${attribute}=["']([^"']+)["']`, 'i'))?.[1] ?? null;
};
const stripHtml = (value) => value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

const sitemapPath = resolve(dist, 'sitemap.xml');
const robotsPath = resolve(dist, 'robots.txt');
if (!existsSync(sitemapPath)) fail('/sitemap.xml', 'missing generated sitemap');
if (!existsSync(robotsPath)) fail('/robots.txt', 'missing robots.txt');

const sitemap = existsSync(sitemapPath) ? await readFile(sitemapPath, 'utf8') : '';
const indexedUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]));
const indexedPaths = indexedUrls.map((url) => url.pathname);
const requiredPaths = [
  '/',
  '/services/',
  '/llc-formation/',
  '/c-corporation/',
  '/s-corporation/',
  '/nonprofit-organization/',
  '/business-renewal/',
  '/registered-agent/',
  '/business-formation/',
  '/browse-by-state/',
  '/statedetails-florida/',
  '/pricing/',
  '/terms-and-conditions/',
  '/privacy-policy/',
];

for (const required of requiredPaths) {
  if (!indexedPaths.includes(required)) fail('/sitemap.xml', `missing ${required}`);
}

for (const url of indexedUrls) {
  const pathname = url.pathname;
  const file = pageFile(pathname);
  if (!existsSync(file)) {
    fail(pathname, 'sitemap URL has no generated HTML');
    continue;
  }

  const html = await readFile(file, 'utf8');
  const title = stripHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '');
  const h1Count = (html.match(/<h1\b/gi) ?? []).length;
  const description = getAttr(html, /<meta\b[^>]*name=["']description["'][^>]*>/i, 'content');
  const robots = getAttr(html, /<meta\b[^>]*name=["']robots["'][^>]*>/i, 'content');
  const canonical = getAttr(html, /<link\b[^>]*rel=["']canonical["'][^>]*>/i, 'href');

  if (!title || title.length < 12) fail(pathname, 'missing or weak title');
  if (!description || description.length < 60) fail(pathname, 'missing or weak meta description');
  if (h1Count !== 1) fail(pathname, `expected exactly one H1, found ${h1Count}`);
  if (!robots || robots.includes('noindex')) fail(pathname, 'page is not indexable');
  if (canonical !== new URL(pathname, origin).href) fail(pathname, `canonical mismatch (${canonical ?? 'missing'})`);
  if (!html.includes('application/ld+json')) fail(pathname, 'missing structured data');

  const hrefs = [...html.matchAll(/<a\b[^>]*href=["']([^"']*)["'][^>]*>/gi)].map((match) => match[1]);
  for (const href of hrefs) {
    if (!href || href === '#') {
      fail(pathname, 'contains an empty or placeholder link');
      continue;
    }
    if (/^(mailto:|tel:|javascript:)/i.test(href)) continue;
    const target = new URL(href, url);
    if (target.origin !== origin.origin) continue;
    const targetFile = pageFile(target.pathname);
    if (!existsSync(targetFile)) {
      fail(pathname, `internal link has no generated page: ${href}`);
      continue;
    }
    if (target.hash) {
      const targetHtml = target.pathname === pathname ? html : await readFile(targetFile, 'utf8');
      const id = decodeURIComponent(target.hash.slice(1));
      const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!new RegExp(`\\bid=["']${escaped}["']`, 'i').test(targetHtml)) fail(pathname, `fragment target does not exist: ${href}`);
    }
  }

  const sources = [...html.matchAll(/<(?:img|source)\b[^>]*(?:src|srcset)=["']([^"']+)["'][^>]*>/gi)]
    .flatMap((match) => match[1].split(',').map((candidate) => candidate.trim().split(/\s+/)[0]));
  for (const source of sources) {
    if (!source.startsWith('/')) continue;
    const assetPath = new URL(source, origin).pathname;
    const diskPath = resolve(dist, `.${assetPath}`);
    if (!existsSync(diskPath) || !(await stat(diskPath)).isFile()) fail(pathname, `missing local asset: ${source}`);
  }
}

if (existsSync(robotsPath)) {
  const robots = await readFile(robotsPath, 'utf8');
  if (!/User-agent:\s*\*/i.test(robots)) fail('/robots.txt', 'missing wildcard user-agent');
  if (!robots.includes('https://nfc.ciwork.co/sitemap.xml')) fail('/robots.txt', 'missing canonical sitemap URL');
}

if (failures.length) {
  console.error(`SEO/link QA failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log(`SEO/link QA passed for ${indexedUrls.length} indexable routes.`);
}
