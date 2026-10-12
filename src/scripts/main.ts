import { gsap } from 'gsap';
import Splide from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';

type Cleanup = () => void;

const cleanups: Cleanup[] = [];
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function addCleanup(callback: Cleanup) {
  cleanups.push(callback);
}

function initTheme() {
  const root = document.documentElement;
  const toggles = [...document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')];
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!toggles.length) return;

  const storedTheme = (): 'light' | 'dark' | null => {
    try {
      const value = localStorage.getItem('nfc-theme');
      return value === 'light' || value === 'dark' ? value : null;
    } catch {
      return null;
    }
  };

  const applyTheme = (theme: 'light' | 'dark') => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    if (themeColor) themeColor.content = theme === 'dark' ? '#07111f' : '#f8f0e3';
    toggles.forEach((toggle) => {
      const next = theme === 'dark' ? 'light' : 'dark';
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.setAttribute('aria-label', `Switch to ${next} theme`);
      const label = toggle.querySelector<HTMLElement>('[data-theme-label]');
      if (label) label.textContent = next === 'dark' ? 'Dark' : 'Light';
    });
  };

  const toggleTheme = () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('nfc-theme', next); } catch { /* storage can be unavailable */ }
    applyTheme(next);
  };
  const syncSystemTheme = (event: MediaQueryListEvent) => {
    if (!storedTheme()) applyTheme(event.matches ? 'dark' : 'light');
  };
  const syncStorage = (event: StorageEvent) => {
    if (event.key === 'nfc-theme') applyTheme(storedTheme() ?? (systemTheme.matches ? 'dark' : 'light'));
  };

  applyTheme(storedTheme() ?? (systemTheme.matches ? 'dark' : 'light'));
  toggles.forEach((toggle) => toggle.addEventListener('click', toggleTheme));
  systemTheme.addEventListener('change', syncSystemTheme);
  window.addEventListener('storage', syncStorage);
  addCleanup(() => {
    toggles.forEach((toggle) => toggle.removeEventListener('click', toggleTheme));
    systemTheme.removeEventListener('change', syncSystemTheme);
    window.removeEventListener('storage', syncStorage);
  });
}

function setBodyLock(locked: boolean) {
  document.body.classList.toggle('is-locked', locked);
}

function initHeader() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const toggle = header?.querySelector<HTMLButtonElement>('[data-menu-toggle]');
  const menu = header?.querySelector<HTMLElement>('[data-menu]');
  const brand = header?.querySelector<HTMLAnchorElement>('.site-header__brand');
  if (!header || !toggle || !menu) return;

  const mobile = () => window.innerWidth <= 991;
  const pageLayers = [...document.querySelectorAll<HTMLElement>('.skip-link, main, footer')];
  let previousY = Math.max(window.scrollY, 0);
  let accumulatedDelta = 0;
  let logoTimer = 0;

  const setPageInert = (inert: boolean) => {
    pageLayers.forEach((layer) => { layer.inert = inert; });
  };

  const syncMenuA11y = () => {
    if (!mobile()) {
      const hidden = header.classList.contains('is-compact');
      menu.inert = hidden;
      menu.setAttribute('aria-hidden', String(hidden));
      return;
    }
    const hidden = !header.classList.contains('is-open');
    menu.inert = hidden;
    menu.setAttribute('aria-hidden', String(hidden));
  };

  const closeMenu = (restoreFocus = false) => {
    header.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');
    setBodyLock(false);
    setPageInert(false);
    syncMenuA11y();
    if (restoreFocus) toggle.focus();
  };

  const openMenu = () => {
    header.classList.remove('is-compact');
    header.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close navigation');
    setBodyLock(true);
    setPageInert(true);
    syncMenuA11y();
  };

  const onToggle = () => header.classList.contains('is-open') ? closeMenu(true) : openMenu();
  const onScroll = () => {
    if (mobile() || header.classList.contains('is-open')) return;
    const currentY = Math.max(window.scrollY, 0);
    const delta = currentY - previousY;
    header.classList.toggle('is-scrolled', currentY >= 300);

    if (currentY < 300) {
      header.classList.remove('is-compact');
      accumulatedDelta = 0;
    } else if (delta !== 0) {
      if (Math.sign(delta) !== Math.sign(accumulatedDelta)) accumulatedDelta = 0;
      accumulatedDelta += delta;
      if (accumulatedDelta > 100) {
        header.classList.add('is-compact');
        accumulatedDelta = 0;
      } else if (accumulatedDelta < -100) {
        header.classList.remove('is-compact');
        accumulatedDelta = 0;
      }
    }
    previousY = currentY;
    syncMenuA11y();
  };

  const onResize = () => {
    if (!mobile() && header.classList.contains('is-open')) closeMenu();
    if (mobile()) header.classList.remove('is-compact');
    previousY = Math.max(window.scrollY, 0);
    accumulatedDelta = 0;
    syncMenuA11y();
  };

  const onMenuClick = (event: Event) => {
    if (mobile() && (event.target as Element).closest('a')) closeMenu();
  };
  const onKeydown = (event: KeyboardEvent) => {
    if (!header.classList.contains('is-open')) return;
    if (event.key === 'Escape') {
      closeMenu(true);
      return;
    }
    if (event.key !== 'Tab') return;

    const focusable = [...header.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')]
      .filter((element) => element.offsetParent !== null && !element.closest('[inert]'));
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    } else if (!header.contains(document.activeElement)) {
      event.preventDefault();
      toggle.focus();
    }
  };
  const onBrandActivate = () => {
    if (!brand || reducedMotion()) return;
    window.clearTimeout(logoTimer);
    brand.classList.remove('is-reacting');
    void brand.offsetWidth;
    brand.classList.add('is-reacting');
    logoTimer = window.setTimeout(() => brand.classList.remove('is-reacting'), 580);
  };

  toggle.addEventListener('click', onToggle);
  menu.addEventListener('click', onMenuClick);
  brand?.addEventListener('pointerenter', onBrandActivate);
  brand?.addEventListener('focus', onBrandActivate);
  document.addEventListener('keydown', onKeydown);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  syncMenuA11y();
  onScroll();

  addCleanup(() => {
    toggle.removeEventListener('click', onToggle);
    menu.removeEventListener('click', onMenuClick);
    brand?.removeEventListener('pointerenter', onBrandActivate);
    brand?.removeEventListener('focus', onBrandActivate);
    document.removeEventListener('keydown', onKeydown);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('resize', onResize);
    window.clearTimeout(logoTimer);
    closeMenu();
  });
}

function initServicesMenu() {
  const root = document.querySelector<HTMLElement>('[data-services-menu]');
  const trigger = root?.querySelector<HTMLAnchorElement>('[data-services-trigger]');
  const panel = root?.querySelector<HTMLElement>('[data-services-panel]');
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (!root || !trigger || !panel) return;

  const desktop = window.matchMedia('(min-width: 992px)');
  let closeTimer = 0;

  const cancelClose = () => window.clearTimeout(closeTimer);
  const setOpen = (open: boolean) => {
    const canOpen = open && desktop.matches && !header?.classList.contains('is-compact');
    root.classList.toggle('is-open', canOpen);
    panel.inert = !canOpen;
    panel.setAttribute('aria-hidden', String(!canOpen));
    if (desktop.matches) trigger.setAttribute('aria-expanded', String(canOpen));
  };
  const open = () => {
    cancelClose();
    setOpen(true);
  };
  const close = (restoreFocus = false) => {
    cancelClose();
    if (restoreFocus && desktop.matches) trigger.focus();
    setOpen(false);
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer = window.setTimeout(() => {
      if (!root.contains(document.activeElement)) close();
    }, 110);
  };
  const syncMode = () => {
    close();
    if (desktop.matches) {
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.setAttribute('aria-controls', panel.id);
      trigger.setAttribute('aria-expanded', 'false');
    } else {
      trigger.removeAttribute('aria-haspopup');
      trigger.removeAttribute('aria-controls');
      trigger.removeAttribute('aria-expanded');
      panel.inert = true;
      panel.setAttribute('aria-hidden', 'true');
    }
  };
  const onFocusOut = (event: FocusEvent) => {
    if (!root.contains(event.relatedTarget as Node | null)) scheduleClose();
  };
  const onKeydown = (event: KeyboardEvent) => {
    if (!desktop.matches) return;
    if (event.key === 'Escape' && root.classList.contains('is-open')) {
      event.preventDefault();
      close(true);
    } else if (event.key === 'ArrowDown' && document.activeElement === trigger) {
      event.preventDefault();
      open();
      panel.querySelector<HTMLAnchorElement>('a[href]')?.focus();
    }
  };
  const onDocumentPointerDown = (event: PointerEvent) => {
    if (!root.contains(event.target as Node)) close();
  };
  const onScroll = () => {
    if (header?.classList.contains('is-compact')) close();
  };

  root.addEventListener('pointerenter', open);
  root.addEventListener('pointerleave', scheduleClose);
  root.addEventListener('focusin', open);
  root.addEventListener('focusout', onFocusOut);
  root.addEventListener('keydown', onKeydown);
  document.addEventListener('pointerdown', onDocumentPointerDown);
  window.addEventListener('scroll', onScroll, { passive: true });
  desktop.addEventListener('change', syncMode);
  syncMode();

  addCleanup(() => {
    cancelClose();
    root.removeEventListener('pointerenter', open);
    root.removeEventListener('pointerleave', scheduleClose);
    root.removeEventListener('focusin', open);
    root.removeEventListener('focusout', onFocusOut);
    root.removeEventListener('keydown', onKeydown);
    document.removeEventListener('pointerdown', onDocumentPointerDown);
    window.removeEventListener('scroll', onScroll);
    desktop.removeEventListener('change', syncMode);
    setOpen(false);
  });
}

function initCarousels() {
  const roots = [...document.querySelectorAll<HTMLElement>('.js-ticker, .js-media-rail')];
  const instances = roots.map((root) => {
    const reduce = reducedMotion();
    const instance = new Splide(root, {
      type: reduce ? 'slide' : 'loop',
      autoWidth: true,
      gap: '1rem',
      arrows: false,
      pagination: false,
      drag: 'free',
      focus: 'center',
      updateOnMove: true,
      autoScroll: {
        speed: 1,
        pauseOnHover: true,
        pauseOnFocus: true,
      },
    });
    instance.mount(reduce ? {} : { AutoScroll });
    return instance;
  });
  addCleanup(() => instances.forEach((instance) => instance.destroy(true)));
}

function initServiceCases() {
  const container = document.querySelector<HTMLElement>('[data-service-cases]');
  if (!container) return;
  const cases = [...container.querySelectorAll<HTMLElement>('[data-service-case]')];
  const desktop = window.matchMedia('(min-width: 1280px) and (pointer: fine)');
  const artOffset = (art: HTMLElement) => Number(art.dataset.artOffset ?? 0);

  const prepare = () => {
    cases.forEach((item) => {
      const detail = item.querySelector<HTMLElement>('.price-shape__detail');
      const art = [...item.querySelectorAll<HTMLElement>('[data-shape-art]')];
      if (desktop.matches && !reducedMotion()) {
        gsap.set(detail, { autoAlpha: 0 });
        art.forEach((accent) => gsap.set(accent, { y: artOffset(accent) }));
      } else {
        gsap.set([detail, ...art], { clearProps: 'all' });
        gsap.set(cases, { clearProps: 'transform' });
      }
    });
  };

  const reset = () => {
    cases.forEach((item) => {
      item.classList.remove('is-active');
      if (!desktop.matches || reducedMotion()) return;
      gsap.to(item, { x: 0, duration: .6, ease: 'expo.out', overwrite: true });
      gsap.to(item.querySelector('.price-shape__detail'), { autoAlpha: 0, duration: .3, ease: 'power2.inOut', overwrite: true });
      item.querySelectorAll<HTMLElement>('[data-shape-art]').forEach((accent) => {
        gsap.to(accent, { y: artOffset(accent), duration: .5, ease: 'power2.out', overwrite: true });
      });
    });
  };

  const bindings = cases.map((item, index) => {
    const enter = () => {
      if (!desktop.matches || reducedMotion()) return;
      cases.forEach((card, cardIndex) => {
        card.classList.toggle('is-active', card === item);
        gsap.to(card, {
          x: cardIndex < index ? -150 : cardIndex > index ? 150 : 0,
          duration: .6,
          ease: 'expo.out',
          overwrite: true,
        });
      });
      gsap.to(item.querySelector('.price-shape__detail'), { autoAlpha: 1, duration: .3, ease: 'power2.inOut', overwrite: true });
      gsap.to(item.querySelectorAll('[data-shape-art]'), { y: 0, duration: .5, ease: 'power2.out', overwrite: true });
    };
    item.addEventListener('pointerenter', enter);
    item.addEventListener('focusin', enter);
    return { item, enter };
  });

  const onFocusOut = (event: FocusEvent) => {
    if (!container.contains(event.relatedTarget as Node | null)) reset();
  };
  const onPointerLeave = () => {
    if (!container.contains(document.activeElement)) reset();
  };
  container.addEventListener('pointerleave', onPointerLeave);
  container.addEventListener('focusout', onFocusOut);
  desktop.addEventListener('change', prepare);
  prepare();

  addCleanup(() => {
    bindings.forEach(({ item, enter }) => {
      item.removeEventListener('pointerenter', enter);
      item.removeEventListener('focusin', enter);
    });
    container.removeEventListener('pointerleave', onPointerLeave);
    container.removeEventListener('focusout', onFocusOut);
    desktop.removeEventListener('change', prepare);
    reset();
  });
}

function initProcessJump() {
  const trigger = document.querySelector<HTMLAnchorElement>('[data-process-jump]');
  const target = document.querySelector<HTMLElement>('#process-steps');
  if (!trigger || !target) return;

  const onClick = (event: MouseEvent) => {
    event.preventDefault();
    const steps = [...target.querySelectorAll<HTMLElement>('[data-process-step]')];
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#process-steps`);
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' });

    gsap.killTweensOf(steps);
    if (reducedMotion()) {
      gsap.set(steps, { clearProps: 'all' });
      return;
    }
    gsap.fromTo(steps, { y: 28, autoAlpha: .35 }, {
      y: 0,
      autoAlpha: 1,
      duration: .62,
      stagger: .11,
      delay: .18,
      ease: 'expo.out',
      clearProps: 'transform,opacity,visibility',
    });
  };

  trigger.addEventListener('click', onClick);
  addCleanup(() => trigger.removeEventListener('click', onClick));
}

function initCustomCursor() {
  const eligibility = window.matchMedia('(min-width: 992px) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const cursor = document.querySelector<HTMLElement>('[data-global-cursor]');
  const label = cursor?.querySelector<HTMLElement>('[data-global-cursor-label]');
  const icon = cursor?.querySelector<HTMLElement>('[data-global-cursor-icon]');
  let bindings: Array<{ zone: HTMLElement; enter: () => void; leave: () => void; move: (event: MouseEvent) => void }> = [];
  let animationFrame = 0;
  let targetX = -200;
  let targetY = -200;
  let currentX = -200;
  let currentY = -200;

  if (!cursor || !label || !icon) return;

  const render = () => {
    currentX += (targetX - currentX) * .22;
    currentY += (targetY - currentY) * .22;
    cursor.style.setProperty('--cursor-x', `${currentX}px`);
    cursor.style.setProperty('--cursor-y', `${currentY}px`);
    if (cursor.classList.contains('is-visible') || Math.abs(targetX - currentX) > .2 || Math.abs(targetY - currentY) > .2) {
      animationFrame = requestAnimationFrame(render);
    } else {
      animationFrame = 0;
    }
  };

  const ensureRender = () => {
    if (!animationFrame) animationFrame = requestAnimationFrame(render);
  };

  const teardown = () => {
    bindings.forEach(({ zone, enter, leave, move }) => {
      zone.removeEventListener('mouseenter', enter);
      zone.removeEventListener('mouseleave', leave);
      zone.removeEventListener('mousemove', move);
    });
    bindings = [];
    cursor.classList.remove('is-visible');
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  };

  const setup = () => {
    teardown();
    if (!eligibility.matches) return;
    bindings = [...document.querySelectorAll<HTMLElement>('[data-cursor-label]')].map((zone) => {
      const enter = () => {
        label.textContent = zone.dataset.cursorLabel || 'EXPLORE';
        icon.className = `ph ${zone.dataset.cursorIcon || 'ph-arrow-up-right'}`;
        cursor.classList.add('is-visible');
        ensureRender();
      };
      const leave = () => { cursor.classList.remove('is-visible'); };
      const move = (event: MouseEvent) => {
        const cursorWidth = cursor.offsetWidth || 110;
        const cursorHeight = cursor.offsetHeight || 58;
        targetX = Math.min(window.innerWidth - cursorWidth - 12, Math.max(12, event.clientX + 20));
        targetY = Math.min(window.innerHeight - cursorHeight - 12, Math.max(12, event.clientY - 64));
        ensureRender();
      };
      zone.addEventListener('mouseenter', enter);
      zone.addEventListener('mouseleave', leave);
      zone.addEventListener('mousemove', move);
      return { zone, enter, leave, move };
    });
  };

  eligibility.addEventListener('change', setup);
  setup();
  addCleanup(() => {
    eligibility.removeEventListener('change', setup);
    teardown();
  });
}

function initPointerReactions() {
  const eligibility = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
  const targets = [...document.querySelectorAll<HTMLElement>('[data-pointer-react]')];
  if (!targets.length) return;

  let pointerX = -1000;
  let pointerY = -1000;
  let animationFrame = 0;
  const influence = 132;

  const resetTarget = (target: HTMLElement) => {
    target.style.setProperty('--pointer-proximity', '0');
    target.style.setProperty('--pointer-shift-x', '0px');
    target.style.setProperty('--pointer-shift-y', '0px');
    target.classList.remove('is-pointer-near');
  };

  const render = () => {
    animationFrame = 0;
    if (!eligibility.matches) {
      targets.forEach(resetTarget);
      return;
    }

    targets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      const nearestX = Math.max(rect.left, Math.min(pointerX, rect.right));
      const nearestY = Math.max(rect.top, Math.min(pointerY, rect.bottom));
      const distance = Math.hypot(pointerX - nearestX, pointerY - nearestY);
      const proximity = Math.max(0, 1 - distance / influence);
      const localX = Math.max(0, Math.min(rect.width, pointerX - rect.left));
      const localY = Math.max(0, Math.min(rect.height, pointerY - rect.top));

      target.style.setProperty('--pointer-proximity', proximity.toFixed(3));
      target.style.setProperty('--pointer-local-x', `${localX}px`);
      target.style.setProperty('--pointer-local-y', `${localY}px`);
      target.classList.toggle('is-pointer-near', proximity > .08);

      if (target.matches('.button, .site-nav__mobile-cta')) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const pull = proximity * 5;
        const shiftX = rect.width ? ((pointerX - centerX) / rect.width) * pull : 0;
        const shiftY = rect.height ? ((pointerY - centerY) / rect.height) * pull : 0;
        target.style.setProperty('--pointer-shift-x', `${shiftX.toFixed(2)}px`);
        target.style.setProperty('--pointer-shift-y', `${shiftY.toFixed(2)}px`);
      }
    });
  };

  const requestRender = () => {
    if (!animationFrame) animationFrame = requestAnimationFrame(render);
  };
  const onPointerMove = (event: PointerEvent) => {
    pointerX = event.clientX;
    pointerY = event.clientY;
    requestRender();
  };
  const onPointerLeave = () => {
    pointerX = -1000;
    pointerY = -1000;
    requestRender();
  };
  const onEligibilityChange = () => requestRender();

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);
  eligibility.addEventListener('change', onEligibilityChange);
  addCleanup(() => {
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    eligibility.removeEventListener('change', onEligibilityChange);
    cancelAnimationFrame(animationFrame);
    targets.forEach(resetTarget);
  });
}

function initFaqs() {
  const lists = [...document.querySelectorAll<HTMLElement>('[data-faq-list]')];
  const bindings: Array<{ trigger: HTMLButtonElement; onClick: () => void }> = [];

  lists.forEach((list) => {
    const triggers = [...list.querySelectorAll<HTMLButtonElement>('[data-faq-trigger]')];
    triggers.forEach((trigger) => {
      const panelId = trigger.getAttribute('aria-controls');
      const panel = panelId ? document.getElementById(panelId) : null;
      const item = trigger.closest<HTMLElement>('.service-faq__item, .faq-item');
      if (!panel || !item) return;

      const onClick = () => {
        const opening = trigger.getAttribute('aria-expanded') !== 'true';
        trigger.setAttribute('aria-expanded', String(opening));
        item.classList.toggle('is-open', opening);
        gsap.killTweensOf(panel);

        if (opening) {
          panel.hidden = false;
          gsap.fromTo(panel, { height: 0, opacity: 0 }, {
            height: 'auto',
            opacity: 1,
            duration: reducedMotion() ? 0 : .42,
            ease: 'power3.out',
            clearProps: 'height,opacity',
          });
        } else {
          gsap.to(panel, {
            height: 0,
            opacity: 0,
            duration: reducedMotion() ? 0 : .3,
            ease: 'power2.inOut',
            onComplete: () => {
              panel.hidden = true;
              gsap.set(panel, { clearProps: 'height,opacity' });
            },
          });
        }
      };

      trigger.addEventListener('click', onClick);
      bindings.push({ trigger, onClick });
    });
  });

  addCleanup(() => bindings.forEach(({ trigger, onClick }) => trigger.removeEventListener('click', onClick)));
}

function initFilingCrew() {
  const eligibility = window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)');
  const crews = [...document.querySelectorAll<HTMLElement>('[data-filing-crew]')];
  const bindings: Array<{ crew: HTMLElement; move: (event: PointerEvent) => void; leave: () => void }> = [];

  crews.forEach((crew) => {
    const figures = [...crew.querySelectorAll<HTMLElement>('[data-filing-figure]')];
    if (!figures.length) return;
    const morphing = new WeakSet<HTMLElement>();
    let activeFigure: HTMLElement | null = null;

    const morph = (figure: HTMLElement) => {
      if (morphing.has(figure)) return;
      const pieces = [...figure.querySelectorAll<HTMLElement>('[data-filing-piece]')];
      if (!pieces.length) return;

      morphing.add(figure);
      gsap.killTweensOf([figure, ...pieces]);

      gsap.timeline()
        .to(figure, {
          scaleX: 1.015,
          scaleY: .965,
          yPercent: 1.2,
          duration: .16,
          ease: 'power2.in',
          transformOrigin: '50% 55%',
        })
        .call(() => {
          const before = pieces.map((piece) => ({
            rect: piece.getBoundingClientRect(),
            opacity: Number.parseFloat(getComputedStyle(piece).opacity),
          }));
          const currentPose = Number.parseInt(figure.dataset.pose ?? '0', 10);
          figure.dataset.pose = String((Number.isFinite(currentPose) ? currentPose + 1 : 1) % 4);
          const after = pieces.map((piece) => ({
            rect: piece.getBoundingClientRect(),
            opacity: Number.parseFloat(getComputedStyle(piece).opacity),
          }));

          pieces.forEach((piece, index) => {
            const first = before[index];
            const last = after[index];
            const width = Math.max(last.rect.width, .01);
            const height = Math.max(last.rect.height, .01);

            gsap.fromTo(piece, {
              x: first.rect.left - last.rect.left,
              y: first.rect.top - last.rect.top,
              scaleX: first.rect.width / width,
              scaleY: first.rect.height / height,
              opacity: first.opacity,
              transformOrigin: '0 0',
            }, {
              x: 0,
              y: 0,
              scaleX: 1,
              scaleY: 1,
              opacity: last.opacity,
              duration: .68,
              delay: index * .012,
              ease: 'expo.inOut',
              overwrite: true,
            });
          });

          gsap.timeline({
            onComplete: () => {
              gsap.set(figure, { clearProps: 'transform,transformOrigin' });
              gsap.set(pieces, { clearProps: 'transform,opacity,transformOrigin' });
              morphing.delete(figure);
            },
          })
            .to(figure, {
              scaleX: .992,
              scaleY: 1.018,
              yPercent: -.35,
              duration: .64,
              ease: 'expo.out',
            })
            .to(figure, {
              scaleX: 1,
              scaleY: 1,
              yPercent: 0,
              duration: .2,
              ease: 'back.out(2)',
            });
        });
    };

    const getHitBounds = (figure: HTMLElement) => {
      const rects = [...figure.querySelectorAll<HTMLElement>('[data-filing-piece]')]
        .filter((piece) => Number.parseFloat(getComputedStyle(piece).opacity) > .02)
        .map((piece) => piece.querySelector<HTMLElement>('.filing-piece__shape')?.getBoundingClientRect()
          ?? piece.getBoundingClientRect())
        .filter((rect) => rect.width > .5 && rect.height > .5);

      if (!rects.length) return null;
      return rects.reduce((bounds, rect) => ({
        left: Math.min(bounds.left, rect.left),
        right: Math.max(bounds.right, rect.right),
        top: Math.min(bounds.top, rect.top),
        bottom: Math.max(bounds.bottom, rect.bottom),
      }), {
        left: rects[0].left,
        right: rects[0].right,
        top: rects[0].top,
        bottom: rects[0].bottom,
      });
    };

    const move = (event: PointerEvent) => {
      if (!eligibility.matches) return;
      const visibleFigures = figures
        .filter((figure) => getComputedStyle(figure).display !== 'none')
        .sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
      const target = visibleFigures.find((figure) => {
        const bounds = getHitBounds(figure);
        if (!bounds) return false;
        return event.clientX >= bounds.left && event.clientX <= bounds.right
          && event.clientY >= bounds.top && event.clientY <= bounds.bottom;
      }) ?? null;

      if (target === activeFigure) return;
      activeFigure = target;
      if (target) morph(target);
    };

    const leave = () => { activeFigure = null; };

    crew.addEventListener('pointermove', move);
    crew.addEventListener('pointerleave', leave);
    window.addEventListener('resize', leave, { passive: true });
    eligibility.addEventListener('change', leave);
    bindings.push({ crew, move, leave });
  });

  addCleanup(() => bindings.forEach(({ crew, move, leave }) => {
    crew.removeEventListener('pointermove', move);
    crew.removeEventListener('pointerleave', leave);
    window.removeEventListener('resize', leave);
    eligibility.removeEventListener('change', leave);
    gsap.killTweensOf(crew.querySelectorAll('[data-filing-piece]'));
    gsap.killTweensOf(crew.querySelectorAll('[data-filing-figure]'));
    gsap.set(crew.querySelectorAll('[data-filing-piece]'), { clearProps: 'transform,opacity,transformOrigin' });
    gsap.set(crew.querySelectorAll('[data-filing-figure]'), { clearProps: 'transform,transformOrigin' });
  }));
}

function initIntakeForm() {
  const form = document.querySelector<HTMLFormElement>('[data-intake-form]');
  if (!form) return;
  const service = form.querySelector<HTMLSelectElement>('[data-intake-service]');
  const state = form.querySelector<HTMLSelectElement>('[data-intake-state]');
  const message = form.querySelector<HTMLElement>('[data-intake-message]');
  const params = new URLSearchParams(window.location.search);

  const setFromQuery = (select: HTMLSelectElement | null, key: string) => {
    const value = params.get(key);
    if (select && value && [...select.options].some((option) => option.value === value)) select.value = value;
  };
  setFromQuery(service, 'service');
  setFromQuery(state, 'state');

  const onSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const lines = [...data.entries()].map(([key, value]) => `${key}: ${String(value).trim() || '—'}`);
    const chosenService = service?.selectedOptions[0]?.text || 'Business filing';
    const subject = `NFC filing request — ${chosenService}`;
    const body = ['Hello NFC,', '', 'I would like help with a filing request:', '', ...lines, '', 'Please contact me with the next steps.'].join('\n');
    if (message) message.textContent = 'Your email client is opening with the request prepared.';
    window.location.href = `mailto:info@nationalfilingcorporation.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  form.addEventListener('submit', onSubmit);
  addCleanup(() => form.removeEventListener('submit', onSubmit));
}

function initStatePicker() {
  const root = document.querySelector<HTMLElement>('[data-state-picker]');
  const select = root?.querySelector<HTMLSelectElement>('[data-state-select]');
  const submit = root?.querySelector<HTMLAnchorElement>('[data-state-submit]');
  const message = root?.querySelector<HTMLElement>('[data-state-message]');
  if (!root || !select || !submit || !message) return;

  const baseHref = '/business-formation/';
  const update = () => {
    if (select.value === 'florida') {
      submit.href = `${baseHref}?state=florida`;
      submit.setAttribute('aria-disabled', 'false');
      submit.removeAttribute('tabindex');
      message.textContent = 'Florida is available now. Continue to begin your filing.';
    } else if (select.value) {
      submit.href = baseHref;
      submit.setAttribute('aria-disabled', 'true');
      submit.tabIndex = -1;
      message.textContent = `${select.options[select.selectedIndex]?.text ?? 'This state'} is coming soon. Florida is currently available.`;
    } else {
      submit.href = baseHref;
      submit.setAttribute('aria-disabled', 'true');
      submit.tabIndex = -1;
      message.textContent = 'Florida is available now. More states are coming soon.';
    }
  };
  const blockDisabled = (event: MouseEvent) => {
    if (submit.getAttribute('aria-disabled') === 'true') event.preventDefault();
  };
  select.addEventListener('change', update);
  submit.addEventListener('click', blockDisabled);
  update();
  addCleanup(() => {
    select.removeEventListener('change', update);
    submit.removeEventListener('click', blockDisabled);
  });
}

function destroySite() {
  while (cleanups.length) cleanups.pop()?.();
  document.documentElement.removeAttribute('data-nfc-ready');
}

function initSite() {
  if (document.documentElement.dataset.nfcReady === 'true') return;
  document.documentElement.dataset.nfcReady = 'true';
  initTheme();
  initHeader();
  initServicesMenu();
  initCarousels();
  initServiceCases();
  initProcessJump();
  initCustomCursor();
  initPointerReactions();
  initFaqs();
  initFilingCrew();
  initStatePicker();
  initIntakeForm();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSite, { once: true });
} else {
  initSite();
}

document.addEventListener('astro:before-swap', destroySite);
