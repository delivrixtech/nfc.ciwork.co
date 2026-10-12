import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve } from 'node:path';
import { chromium } from 'playwright';

const projectRoot = resolve(import.meta.dirname, '..');
const distRoot = resolve(projectRoot, 'dist');
const motionSourcePath = resolve(projectRoot, 'src/scripts/main.ts');
const suppliedBaseUrl = process.env.MOTION_BASE_URL?.trim();
const failures = [];
const reports = [];

const motionGroups = [
  {
    name: 'process',
    root: '.process',
    targets: '.process__intro h2, .process-film, .process-step > *',
    requiredTargets: [
      { name: 'heading', selector: '.process__intro h2' },
      { name: 'film', selector: '.process-film' },
      { name: 'steps', selector: '.process-step > *' },
    ],
  },
  {
    name: 'services',
    root: '.services',
    targets: '.services .section-heading h2, .platform-card',
    requiredTargets: [
      { name: 'heading', selector: '.services .section-heading h2' },
      { name: 'cards', selector: '.platform-card' },
    ],
  },
  {
    name: 'pricing',
    root: '.pricing',
    targets: '.price-shape__surface, .price-shape [data-shape-art]',
    requiredTargets: [
      { name: 'surfaces', selector: '.price-shape__surface' },
      { name: 'art', selector: '.price-shape [data-shape-art]' },
    ],
  },
  {
    name: 'states',
    root: '.state-story',
    targets: '.state-story__heading h2, .state-story__panel, .state-story__media, .state-story__more',
    requiredTargets: [
      { name: 'heading', selector: '.state-story__heading h2' },
      { name: 'panel', selector: '.state-story__panel' },
      { name: 'media', selector: '.state-story__media' },
      { name: 'more', selector: '.state-story__more' },
    ],
  },
  {
    name: 'results',
    root: '.service-rail',
    targets: '.service-rail__header h2, .service-rail .splide__track',
    requiredTargets: [
      { name: 'heading', selector: '.service-rail__header h2' },
      { name: 'track', selector: '.service-rail .splide__track' },
    ],
  },
  {
    name: 'final-cta',
    root: '.final-cta',
    targets: '.final-cta h2, .final-cta__actions, .filing-crew, .filing-figure',
    requiredTargets: [
      { name: 'heading', selector: '.final-cta h2' },
      { name: 'actions', selector: '.final-cta__actions' },
      { name: 'crew', selector: '.filing-crew' },
      { name: 'figures', selector: '.filing-figure' },
    ],
  },
];

const scenarios = [
  {
    name: 'mobile-390x844',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  },
  {
    name: 'tablet-768x1024',
    viewport: { width: 768, height: 1024 },
    isMobile: true,
    hasTouch: true,
  },
  {
    name: 'desktop-1440x900',
    viewport: { width: 1440, height: 900 },
    isMobile: false,
    hasTouch: false,
  },
];

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
};

function addFailure(scope, message) {
  failures.push(`[${scope}] ${message}`);
}

async function startDistServer() {
  if (!existsSync(resolve(distRoot, 'index.html'))) {
    throw new Error('dist/index.html is missing. Run `npm run build` before the motion QA.');
  }

  const server = createServer(async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
      let filePath = resolve(distRoot, relativePath);
      const insideDist = filePath === distRoot || filePath.startsWith(`${distRoot}/`);

      if (!insideDist) {
        response.writeHead(403).end('Forbidden');
        return;
      }

      const fileStat = await stat(filePath);
      if (fileStat.isDirectory()) filePath = resolve(filePath, 'index.html');
      const content = await readFile(filePath);
      response.writeHead(200, {
        'cache-control': 'no-store',
        'content-type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
      });
      response.end(content);
    } catch {
      response.writeHead(404).end('Not found');
    }
  });

  await new Promise((resolveListen) => server.listen(0, '127.0.0.1', resolveListen));
  const address = server.address();
  if (!address || typeof address === 'string') throw new Error('Unable to start the motion QA server.');
  return { server, baseUrl: `http://127.0.0.1:${address.port}` };
}

async function closeServer(server) {
  if (!server) return;
  server.closeAllConnections();
  await new Promise((resolveClose) => server.close(resolveClose));
}

function inspectScrollTriggerSource(source) {
  const importsPlugin = /(?:from\s*['"]gsap\/(?:ScrollTrigger|dist\/ScrollTrigger|all)['"]|import\s*['"]gsap\/(?:ScrollTrigger|dist\/ScrollTrigger)['"])/.test(source);
  const registersPlugin = /gsap\.registerPlugin\s*\([^)]*\bScrollTrigger\b[^)]*\)/s.test(source);
  const createsTriggers = /(?:\bScrollTrigger\.(?:create|batch|matchMedia)\s*\(|\bscrollTrigger\s*:)/.test(source);
  return { importsPlugin, registersPlugin, createsTriggers };
}

async function installErrorCapture(page) {
  const errors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(`console: ${message.text()}`);
  });
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`));
  return errors;
}

async function waitUntilReady(page, baseUrl) {
  await page.goto(new URL('/', baseUrl).href, { waitUntil: 'networkidle', timeout: 60_000 });
  await page.waitForFunction(() => document.documentElement.dataset.nfcReady === 'true', null, { timeout: 10_000 });
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(120);
}

async function getOverflow(page) {
  return page.evaluate(() => Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth);
}

async function snapshotTargets(page, selector) {
  return page.evaluate((targetSelector) => [...document.querySelectorAll(targetSelector)].map((element) => {
    const style = getComputedStyle(element);
    return {
      clipPath: style.clipPath,
      opacity: style.opacity,
      transform: style.transform,
    };
  }), selector);
}

async function snapshotRequiredTargets(page, requiredTargets) {
  return page.evaluate((checks) => Object.fromEntries(checks.map(({ name, selector }) => [
    name,
    [...document.querySelectorAll(selector)].map((element) => {
      const style = getComputedStyle(element);
      return {
        clipPath: style.clipPath,
        opacity: style.opacity,
        transform: style.transform,
      };
    }),
  ])), requiredTargets);
}

function changedProperties(frames) {
  const properties = ['transform', 'opacity', 'clipPath'];
  const changes = new Set();
  const targetCount = Math.max(...frames.map((frame) => frame.length), 0);

  for (let targetIndex = 0; targetIndex < targetCount; targetIndex += 1) {
    for (const property of properties) {
      const values = new Set(frames.map((frame) => frame[targetIndex]?.[property] ?? '__missing__'));
      if (values.size > 1) changes.add(property);
    }
  }

  return [...changes];
}

async function exerciseMotionGroup(page, group) {
  const position = await page.evaluate(({ root, requiredTargets }) => {
    const section = document.querySelector(root);
    const targetGroups = requiredTargets.map(({ name, selector }) => {
      const elements = [...document.querySelectorAll(selector)];
      const tops = elements.map((element) => element.getBoundingClientRect().top + window.scrollY);
      return {
        count: elements.length,
        name,
        top: tops.length ? Math.min(...tops) : null,
      };
    });
    const targetTops = targetGroups.flatMap(({ top }) => top === null ? [] : [top]);
    return {
      documentHeight: document.documentElement.scrollHeight,
      sectionTop: section ? section.getBoundingClientRect().top + window.scrollY : null,
      targetGroups,
      targetMaxTop: targetTops.length ? Math.max(...targetTops) : null,
      targetMinTop: targetTops.length ? Math.min(...targetTops) : null,
      viewportHeight: window.innerHeight,
    };
  }, { root: group.root, requiredTargets: group.requiredTargets });

  const missingTargets = position.targetGroups.filter(({ count }) => count === 0).map(({ name }) => name);
  if (position.sectionTop === null || position.targetMinTop === null || position.targetMaxTop === null || missingTargets.length) {
    return {
      changed: false,
      changedProperties: [],
      checks: group.requiredTargets.map(({ name }) => ({ changed: false, name, properties: [] })),
      missing: true,
      missingTargets,
      samples: 0,
    };
  }

  const maxScroll = Math.max(0, position.documentHeight - position.viewportHeight);
  const startY = Math.max(0, Math.min(maxScroll, position.targetMinTop - position.viewportHeight * 1.05));
  const endY = Math.max(startY, Math.min(maxScroll, position.targetMaxTop - position.viewportHeight * 0.12));
  const distance = endY - startY;
  const stepCount = Math.max(8, Math.min(24, Math.ceil(distance / Math.max(position.viewportHeight * .24, 1))));
  const frames = Object.fromEntries(group.requiredTargets.map(({ name }) => [name, []]));

  const sample = async () => {
    const snapshots = await snapshotRequiredTargets(page, group.requiredTargets);
    group.requiredTargets.forEach(({ name }) => frames[name].push(snapshots[name]));
  };

  await page.evaluate((y) => window.scrollTo(0, y), startY);
  await page.waitForTimeout(80);
  await sample();

  for (let step = 1; step <= stepCount; step += 1) {
    const y = startY + (distance * step) / stepCount;
    await page.evaluate((nextY) => window.scrollTo(0, nextY), y);
    await page.waitForTimeout(55);
    await sample();
    await page.waitForTimeout(75);
    await sample();
  }

  const checks = group.requiredTargets.map(({ name }) => {
    const properties = changedProperties(frames[name]);
    return { changed: properties.length > 0, name, properties };
  });
  const properties = [...new Set(checks.flatMap((check) => check.properties))];
  return {
    changed: checks.every((check) => check.changed),
    changedProperties: properties,
    checks,
    missing: false,
    missingTargets: [],
    samples: 1 + stepCount * 2,
  };
}

async function visibleMotionContent(page, group) {
  const position = await page.evaluate((rootSelector) => {
    const section = document.querySelector(rootSelector);
    if (!section) return null;
    return section.getBoundingClientRect().top + window.scrollY;
  }, group.root);
  if (position === null) return { visible: false, visibleCount: 0, targetCount: 0 };

  await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - window.innerHeight * 0.55)), position);
  await page.waitForTimeout(80);

  return page.evaluate((selector) => {
    const targets = [...document.querySelectorAll(selector)];
    const visibleCount = targets.filter((element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const intersectsViewport = rect.bottom > 0 && rect.top < window.innerHeight;
      return style.display !== 'none'
        && style.visibility !== 'hidden'
        && Number.parseFloat(style.opacity) >= 0.95
        && rect.width > 1
        && rect.height > 1
        && intersectsViewport;
    }).length;
    return { visible: visibleCount > 0, visibleCount, targetCount: targets.length };
  }, group.targets);
}

async function inspectSignificantAnimations(page) {
  return page.evaluate(() => document.getAnimations({ subtree: true }).flatMap((animation) => {
    const effect = animation.effect;
    const timing = effect?.getTiming?.();
    const duration = typeof timing?.duration === 'number' ? timing.duration : Number.POSITIVE_INFINITY;
    const iterations = timing?.iterations ?? 1;
    if (animation.playState !== 'running' || (duration <= 50 && iterations !== Number.POSITIVE_INFINITY)) return [];
    return [{
      duration,
      iterations,
      target: effect?.target?.className || effect?.target?.tagName || 'unknown',
    }];
  }));
}

async function runMotionScenario(browser, baseUrl, scenario) {
  const context = await browser.newContext({
    viewport: scenario.viewport,
    isMobile: scenario.isMobile,
    hasTouch: scenario.hasTouch,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  const errors = await installErrorCapture(page);

  try {
    await waitUntilReady(page, baseUrl);
    const overflow = await getOverflow(page);
    const groupResults = [];

    for (const group of motionGroups) {
      groupResults.push({ name: group.name, ...await exerciseMotionGroup(page, group) });
    }

    const animatedGroups = groupResults.filter((result) => result.changed);
    const missingGroups = groupResults.filter((result) => result.missing);
    const finalOverflow = await getOverflow(page);
    const maximumOverflow = Math.max(overflow, finalOverflow);

    if (maximumOverflow > 0) addFailure(scenario.name, `horizontal overflow is ${maximumOverflow}px`);
    if (errors.length) addFailure(scenario.name, `${errors.length} console/page error(s): ${errors.join(' | ')}`);
    if (missingGroups.length) addFailure(scenario.name, `missing motion target(s): ${missingGroups.map(({ name }) => name).join(', ')}`);
    if (animatedGroups.length !== motionGroups.length) {
      const staticGroups = groupResults
        .filter((result) => !result.changed && !result.missing)
        .map(({ name }) => name);
      addFailure(
        scenario.name,
        `${animatedGroups.length}/${motionGroups.length} sections changed during scroll; static: ${staticGroups.join(', ') || 'none'}`,
      );
    }

    reports.push({
      errors: errors.length,
      motion: groupResults.map(({ name, checks }) => (
        `${name}[${checks.map((check) => `${check.name}:${check.properties.join('+') || 'static'}`).join('|')}]`
      )).join(', '),
      name: scenario.name,
      overflow: maximumOverflow,
    });
  } finally {
    await context.close();
  }
}

async function runReducedMotionScenario(browser, baseUrl) {
  const name = 'mobile-390x844/reduced-motion';
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  const errors = await installErrorCapture(page);

  try {
    await waitUntilReady(page, baseUrl);
    const overflow = await getOverflow(page);
    const significantAnimations = await inspectSignificantAnimations(page);
    const carouselBefore = await page.locator('.splide__list').evaluateAll((elements) => elements.map((element) => getComputedStyle(element).transform));
    const groupResults = [];

    for (const group of motionGroups) {
      const motion = await exerciseMotionGroup(page, group);
      const visibility = await visibleMotionContent(page, group);
      groupResults.push({ name: group.name, motion, visibility });
    }

    await page.waitForTimeout(400);
    const carouselAfter = await page.locator('.splide__list').evaluateAll((elements) => elements.map((element) => getComputedStyle(element).transform));
    const movingGroups = groupResults.filter(({ motion }) => motion.changed);
    const hiddenGroups = groupResults.filter(({ visibility }) => !visibility.visible);
    const carouselMoved = JSON.stringify(carouselBefore) !== JSON.stringify(carouselAfter);

    if (overflow > 0) addFailure(name, `horizontal overflow is ${overflow}px`);
    if (errors.length) addFailure(name, `${errors.length} console/page error(s): ${errors.join(' | ')}`);
    if (significantAnimations.length) {
      addFailure(name, `significant animations remain active: ${significantAnimations.map(({ target }) => target).join(', ')}`);
    }
    if (movingGroups.length) addFailure(name, `scroll motion remains active in: ${movingGroups.map(({ name: groupName }) => groupName).join(', ')}`);
    if (hiddenGroups.length) addFailure(name, `content is not visibly available in: ${hiddenGroups.map(({ name: groupName }) => groupName).join(', ')}`);
    if (carouselMoved) addFailure(name, 'Splide auto-scroll still moves when reduced motion is requested');

    reports.push({
      errors: errors.length,
      motion: movingGroups.length ? movingGroups.map(({ name: groupName }) => groupName).join(', ') : 'disabled',
      name,
      overflow,
      visibleGroups: `${motionGroups.length - hiddenGroups.length}/${motionGroups.length}`,
    });
  } finally {
    await context.close();
  }
}

async function runDynamicReducedMotionScenario(browser, baseUrl) {
  const name = 'desktop-1440x900/dynamic-reduced-motion';
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    isMobile: false,
    hasTouch: false,
    reducedMotion: 'no-preference',
  });
  const page = await context.newPage();
  const errors = await installErrorCapture(page);

  try {
    await waitUntilReady(page, baseUrl);
    const pricingCards = page.locator('[data-service-case]');
    const interactiveCard = pricingCards.nth(1);
    await interactiveCard.scrollIntoViewIfNeeded();
    await page.waitForTimeout(240);
    await interactiveCard.hover();
    await page.waitForTimeout(420);

    const cardTransformsBefore = await pricingCards.evaluateAll((elements) => (
      elements.map((element) => getComputedStyle(element).transform)
    ));
    const hoverActivated = cardTransformsBefore.some((transform) => transform !== 'none');

    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(700);

    const reducedState = await page.evaluate(() => ({
      cardTransforms: [...document.querySelectorAll('[data-service-case]')]
        .map((element) => getComputedStyle(element).transform),
      detailOpacity: [...document.querySelectorAll('.price-shape__detail')]
        .map((element) => Number.parseFloat(getComputedStyle(element).opacity)),
      overflow: Math.max(document.documentElement.scrollWidth, document.body.scrollWidth) - window.innerWidth,
    }));
    const carouselReducedBefore = await page.locator('.splide__list').evaluateAll((elements) => (
      elements.map((element) => getComputedStyle(element).transform)
    ));
    await page.waitForTimeout(500);
    const carouselReducedAfter = await page.locator('.splide__list').evaluateAll((elements) => (
      elements.map((element) => getComputedStyle(element).transform)
    ));
    const significantAnimations = await inspectSignificantAnimations(page);

    if (!hoverActivated) addFailure(name, 'pricing hover did not activate before the preference changed');
    if (reducedState.cardTransforms.some((transform) => transform !== 'none')) {
      addFailure(name, 'pricing cards retained transforms after switching to reduced motion');
    }
    if (reducedState.detailOpacity.some((opacity) => opacity < .95)) {
      addFailure(name, 'pricing details stayed hidden after switching to reduced motion');
    }
    if (JSON.stringify(carouselReducedBefore) !== JSON.stringify(carouselReducedAfter)) {
      addFailure(name, 'Splide auto-scroll kept moving after switching to reduced motion');
    }
    if (significantAnimations.length) {
      addFailure(name, `significant animations remain active after preference change: ${significantAnimations.map(({ target }) => target).join(', ')}`);
    }
    if (reducedState.overflow > 0) addFailure(name, `horizontal overflow is ${reducedState.overflow}px`);
    if (errors.length) addFailure(name, `${errors.length} console/page error(s): ${errors.join(' | ')}`);

    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(350);
    const carouselResumeBefore = await page.locator('.splide__list').evaluateAll((elements) => (
      elements.map((element) => getComputedStyle(element).transform)
    ));
    await page.waitForTimeout(700);
    const carouselResumeAfter = await page.locator('.splide__list').evaluateAll((elements) => (
      elements.map((element) => getComputedStyle(element).transform)
    ));
    const carouselResumed = JSON.stringify(carouselResumeBefore) !== JSON.stringify(carouselResumeAfter);
    if (!carouselResumed) addFailure(name, 'Splide auto-scroll did not resume after restoring motion preference');

    reports.push({
      carousel: `stopped=${JSON.stringify(carouselReducedBefore) === JSON.stringify(carouselReducedAfter)}, resumed=${carouselResumed}`,
      errors: errors.length,
      hoverReset: reducedState.cardTransforms.every((transform) => transform === 'none'),
      name,
      overflow: reducedState.overflow,
    });
  } finally {
    await context.close();
  }
}

let localServer;
let browser;

try {
  const motionSource = await readFile(motionSourcePath, 'utf8');
  const scrollTrigger = inspectScrollTriggerSource(motionSource);
  if (!scrollTrigger.importsPlugin) addFailure('source', 'ScrollTrigger is not imported from GSAP');
  if (!scrollTrigger.registersPlugin) addFailure('source', 'ScrollTrigger is not registered with gsap.registerPlugin()');
  if (!scrollTrigger.createsTriggers) addFailure('source', 'no ScrollTrigger instance or scrollTrigger tween configuration was found');

  let baseUrl;
  if (suppliedBaseUrl) {
    baseUrl = new URL(suppliedBaseUrl).href;
  } else {
    const local = await startDistServer();
    localServer = local.server;
    baseUrl = local.baseUrl;
  }

  const chromeCandidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);
  const executablePath = chromeCandidates.find((candidate) => existsSync(candidate));
  browser = await chromium.launch(executablePath ? { headless: true, executablePath } : { headless: true });

  for (const scenario of scenarios) await runMotionScenario(browser, baseUrl, scenario);
  await runReducedMotionScenario(browser, baseUrl);
  await runDynamicReducedMotionScenario(browser, baseUrl);
} finally {
  await browser?.close();
  await closeServer(localServer);
}

for (const report of reports) {
  const details = Object.entries(report)
    .filter(([key]) => key !== 'name')
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');
  console.log(`[motion] ${report.name}: ${details}`);
}

if (failures.length) {
  console.error(`Motion QA failed with ${failures.length} issue(s):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exitCode = 1;
} else {
  console.log('Motion QA passed: ScrollTrigger is configured, responsive scroll motion is observable, overflow is zero, and reduced motion remains readable and still.');
}
