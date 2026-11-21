import { useEffect, useRef, useState } from 'react';
import { DEFAULT_STATE } from './types';
import { createStore } from './store/store';
import { loadSettings, persistSettings } from './store/persist';
import { Router } from './router/router';
import { Nav } from './components/Nav';
import { HomePage } from './pages/Home';
import { SettingsPage } from './pages/Settings';
import { AboutPage } from './pages/About';
import { DashboardPage } from './pages/Dashboard';
import { ContactsPage } from './pages/Contacts';
import { ActivityLogPage } from './pages/ActivityLog';

/**
 * Главный компонент приложения.
 */
export function App() {
  const storeRef = useRef(
    createStore({
      ...DEFAULT_STATE,
      settings: { ...DEFAULT_STATE.settings, ...loadSettings() },
    }),
  );
  const mainRef = useRef<HTMLElement>(null);
  const [currentPath, setCurrentPath] = useState('/');

  useEffect(() => {
    const store = storeRef.current;

    const applyTheme = (): void => {
      document.documentElement.dataset.theme = store.getState().settings.theme;
    };
    applyTheme();
    store.subscribe(applyTheme);

    persistSettings(store);

    const router = new Router(mainRef.current!, store, {
      onNavigate: (path) => {
        setCurrentPath(path);
        const { stats, activityLog } = store.getState();
        store.setState({
          stats: {
            visits: stats.visits + 1,
            lastVisit: new Date().toISOString(),
          },
          activityLog: [
            ...activityLog,
            {
              id: crypto.randomUUID(),
              type: 'navigation' as const,
              description: `Переход на страницу «${path}»`,
              timestamp: new Date().toISOString(),
            },
          ],
        });
      },
    });

    router
      .addPage({ path: '/', title: 'Главная', component: HomePage })
      .addPage({ path: '/settings', title: 'Настройки', component: SettingsPage })
      .addPage({ path: '/about', title: 'О приложении', component: AboutPage })
      .addPage({ path: '/dashboard', title: 'Дашборд', component: DashboardPage })
      .addPage({ path: '/contacts', title: 'Контакты', component: ContactsPage })
      .addPage({ path: '/activity-log', title: 'Лог активности', component: ActivityLogPage });

    router.start();
  }, []);

  return (
    <div className="app">
      <header className="app-header">
        <span className="brand">Mini SPA</span>
        <Nav activePath={currentPath} />
      </header>
      <main className="app-main" id="main" ref={mainRef} />
    </div>
  );
}