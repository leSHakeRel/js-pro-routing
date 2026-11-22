import { createBrowserRouter, Link, Outlet } from 'react-router';
import { useEffect, lazy, Suspense, type ReactNode } from 'react';
import type { Store } from '../store/store';
import { useStore } from '../hooks/useStoreSubscription';
import { HomePage } from '../pages/Home';
import { AboutPage } from '../pages/About';
import { ContactsPage } from '../pages/Contacts';
import { ContactDetailPage } from '../pages/ContactDetail';
import { DashboardPage } from '../pages/Dashboard';

/**
 * Отслеживает текущий раздел, обновляет `currentSection` в сторе,
 * увеличивает счётчик посещений и добавляет запись в лог активности при навигации.
 */
function TrackedPage({
  path,
  store,
  children,
}: {
  path: string;
  store: Store;
  children: ReactNode;
}): ReactNode {
  useEffect(() => {
    const { stats, activityLog, sessionRestored } = store.getState();

    // При восстановлении сессии — не подсвечиваем вкладку,
    // не инкрементируем visits и не пишем в activityLog.
    // Сбрасываем флаг, чтобы следующие навигации работали штатно.
    if (sessionRestored) {
      store.setState({ sessionRestored: false });
      return;
    }

    store.setState({
      currentSection: path,
      stats: {
        visits: stats.visits + 1,
        lastVisit: new Date().toISOString(),
      },
      activityLog: [
        ...activityLog,
        {
          id: crypto.randomUUID(),
          type: 'navigation',
          description: `Переход на страницу: ${path}`,
          timestamp: new Date().toISOString(),
        },
      ],
    });
  }, [path]);

  return children;
}

const LINKS: ReadonlyArray<{ path: string; label: string }> = [
  { path: '/', label: 'Главная' },
  { path: '/settings', label: 'Настройки' },
  { path: '/about', label: 'О приложении' },
  { path: '/dashboard', label: 'Дашборд' },
  { path: '/contacts', label: 'Контакты' },
  { path: '/activity-log', label: 'Лог' },
];

/**
 * Layout-компонент, который оборачивает все страницы.
 * Содержит header с навигацией и main с <Outlet /> для вложенных маршрутов.
 * Находится внутри RouterProvider, поэтому <Link> работает корректно.
 */
function AppLayout({ store }: { store: Store }): ReactNode {
  const { currentSection } = useStore(store);

  return (
    <div className="app">
      <header className="app-header">
        <span className="brand">Mini SPA</span>
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
      </header>
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}

/**
 * Лениво загружаемые страницы через React.lazy().
 * Settings и ActivityLog — самые «тяжёлые» страницы.
 */
const LazySettingsPage = lazy(() =>
  import('../pages/Settings').then((m) => ({ default: m.SettingsPage })),
);
const LazyActivityLogPage = lazy(() =>
  import('../pages/ActivityLog').then((m) => ({ default: m.ActivityLogPage })),
);

/**
 * Создаёт роутер React Router 8 с определением всех маршрутов.
 * Использует `createBrowserRouter` + `RouterProvider`.
 * Все маршруты вложены в layout-route с AppLayout, который содержит
 * навигацию и <Outlet />. Это гарантирует, что <Link> и другие хуки
 * роутера находятся внутри контекста RouterProvider.
 */
export function createAppRouter(store: Store) {
  return createBrowserRouter([
    {
      path: '/',
      element: <AppLayout store={store} />,
      children: [
        {
          index: true,
          element: (
            <TrackedPage path="/" store={store}>
              <HomePage store={store} />
            </TrackedPage>
          ),
        },
        {
          path: 'about',
          element: (
            <TrackedPage path="/about" store={store}>
              <AboutPage store={store} />
            </TrackedPage>
          ),
        },
        {
          path: 'contacts',
          element: (
            <TrackedPage path="/contacts" store={store}>
              <ContactsPage store={store} />
            </TrackedPage>
          ),
        },
        {
          path: 'contacts/:id',
          element: (
            <TrackedPage path="/contacts/:id" store={store}>
              <ContactDetailPage store={store} />
            </TrackedPage>
          ),
        },
        {
          path: 'dashboard',
          element: (
            <TrackedPage path="/dashboard" store={store}>
              <DashboardPage store={store} />
            </TrackedPage>
          ),
        },
        {
          path: 'settings',
          element: (
            <TrackedPage path="/settings" store={store}>
              <Suspense fallback={<div className="loading">Загрузка...</div>}>
                <LazySettingsPage store={store} />
              </Suspense>
            </TrackedPage>
          ),
        },
        {
          path: 'activity-log',
          element: (
            <TrackedPage path="/activity-log" store={store}>
              <Suspense fallback={<div className="loading">Загрузка...</div>}>
                <LazyActivityLogPage store={store} />
              </Suspense>
            </TrackedPage>
          ),
        },
      ],
    },
  ]);
}