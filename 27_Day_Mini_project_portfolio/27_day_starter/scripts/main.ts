const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function setActive(items: Element[], activeIndex: number) {
  items.forEach((item, index) => {
    item.classList.toggle("is-active", index === activeIndex);
  });
}

function startLinkedRotators(rootSelectors: string[], intervalMs: number) {
  const groups = rootSelectors
    .map((selector) => document.querySelector(selector))
    .filter((root) => root !== null)
    .map((root) => Array.from(root.querySelectorAll(".rotator__item")));

  if (groups.length === 0 || groups.some((items) => items.length === 0)) {
    return;
  }

  const activeIndices = Array.from({ length: groups.length }).fill(0) as number[];
  const itemCounts = groups.map((items) => items.length);

  requestAnimationFrame(() => {
    groups.forEach((items, idx) => setActive(items, activeIndices[idx]));
  });

  if (prefersReducedMotion || groups.some((items) => items.length === 1)) {
    return;
  }

  window.setInterval(() => {
    groups.forEach((items, idx) => {
      activeIndices[idx] = (activeIndices[idx] + 1) % itemCounts[idx];
      setActive(items, activeIndices[idx]);
    });
  }, intervalMs);
}

startLinkedRotators([".rotator--icon", ".rotator--title", ".rotator--word"], 2000);
