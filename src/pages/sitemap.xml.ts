import type { APIRoute } from 'astro';
import { indexedServicePaths } from '../data/services';

const indexedPaths = [
  '/',
  '/services/',
  ...indexedServicePaths,
  '/business-formation/',
  '/browse-by-state/',
  '/statedetails-florida/',
  '/pricing/',
  '/terms-and-conditions/',
  '/privacy-policy/',
] as const;

const escapeXml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&apos;');

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('https://nfc.ciwork.co');
  const urls = indexedPaths
    .map((path) => `  <url><loc>${escapeXml(new URL(path, origin).href)}</loc></url>`)
    .join('\n');

  const body = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
