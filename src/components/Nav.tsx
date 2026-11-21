import type { ReactNode } from 'react';

const LINKS: ReadonlyArray<{ path: string; label: string }> = [
  { path: '/', label: 'Главная' },
  { path: '/settings', label: 'Настройки' },
  { path: '/about', label: 'О приложении' },
  { path: '/dashboard', label: 'Дашборд' },
  { path: '/contacts', label: 'Контакты' },
  { path: '/activity-log', label: 'Лог' },
];

/** React-компонент навигации */
export function Nav({ activePath }: { activePath?: string }): ReactNode {
  return (
    <nav className="nav">
      {LINKS.map(({ path, label }) => (
        <a
          key={path}
          href={path}
          data-link=""
          className={path === activePath ? 'active' : ''}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}