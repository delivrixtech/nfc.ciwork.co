import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const browser = await chromium.launch({
  headless: true,
  ...(existsSync(chromePath) ? { executablePath: chromePath } : {}),
});

const cases = [
  { name: 'desktop-light', width: 1440, height: 900, theme: 'light' },
  { name: 'desktop-dark', width: 1440, height: 900, theme: 'dark' },
  { name: 'tablet-light', width: 834, height: 1040, theme: 'light' },
  { name: 'mobile-light', width: 402, height: 874, theme: 'light' },
];

for (const item of cases) {
  const context = await browser.newContext({ viewport: { width: item.width, height: item.height } });
  await context.addInitScript((theme) => localStorage.setItem('nfc-theme', theme), item.theme);
  const page = await context.newPage();
  await page.route('**/*', (route) => route.request().resourceType() === 'media' ? route.abort() : route.continue());
  await page.goto('http://127.0.0.1:4321/', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  const metrics = await page.evaluate(() => ({
    width: document.documentElement.scrollWidth,
    height: document.documentElement.scrollHeight,
    sections: [...document.querySelectorAll('main > section')].map((section) => ({
      className: section.className,
      top: Math.round(section.getBoundingClientRect().top + scrollY),
      height: Math.round(section.getBoundingClientRect().height),
    })),
  }));
  console.log(item.name, JSON.stringify(metrics));
  await page.screenshot({ path: `/tmp/nfc-${item.name}.png`, fullPage: true });
  await context.close();
}

await browser.close();
