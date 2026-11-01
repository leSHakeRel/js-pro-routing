const LINKS: ReadonlyArray<{ path: string; label: string }> = [
  { path: '/', label: 'Главная' },
  { path: '/settings', label: 'Настройки' },
  { path: '/about', label: 'О приложении' },
  { path: '/dashboard', label: 'Дашборд' },
];

export function createNav(): HTMLElement {
  const nav = document.createElement('nav');
  nav.className = 'nav';

  for (const { path, label } of LINKS) {
    const link = document.createElement('a');
    link.href = path;
    link.dataset.link = '';
    link.textContent = label;
    nav.appendChild(link);
  }

  return nav;
}

/** активный пункт навигации */
export function updateNavActive(nav: HTMLElement, path: string): void {
  for (const link of nav.querySelectorAll('a')) {
    link.classList.toggle('active', link.getAttribute('href') === path);
  }
}