import { Link } from 'react-router';
import type { ReactNode } from 'react';
import type { Store } from '../store/store';
import { useStore } from '../hooks/useStoreSubscription';

const LINKS: ReadonlyArray<{ path: string; label: string }> = [
  { path: '/', label: 'Главная' },
  { path: '/settings', label: 'Настройки' },
  { path: '/about', label: 'О приложении' },
  { path: '/dashboard', label: 'Дашборд' },
  { path: '/contacts', label: 'Контакты' },
  { path: '/activity-log', label: 'Лог' },
];

/**
 * React-компонент навигации.
 */
export function Nav({ store }: { store: Store }): ReactNode {
  const { currentSection } = useStore(store);

  return (
    <nav className="nav">
      {LINKS.map(({ path, label }) => (
        <Link
          key={path}
          to={path}
          className={path === currentSection ? 'active' : ''}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}