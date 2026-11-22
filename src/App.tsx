import { useEffect } from 'react';
import { RouterProvider } from 'react-router/dom';
import { DEFAULT_STATE } from './types';
import { createStore } from './store/store';
import { loadStore, persistStore, loadActivityLog, persistActivityLog, loadCurrentSection, persistCurrentSection } from './store/persist';
import { createAppRouter } from './router/reactRouter';

/**
 * Главный компонент приложения.
 */
export function App() {
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const isDefaultRoute = currentPath === '/';
  const saved = loadStore();
  const hasSavedData = saved.stats?.visits ? saved.stats.visits > 0 : false;
  const savedSection = loadCurrentSection();

  if (hasSavedData && savedSection && isDefaultRoute && savedSection !== currentPath) {
    window.location.replace(savedSection);
    return null;
  }

  const store = createStore({
    ...DEFAULT_STATE,
    currentSection: (isDefaultRoute && savedSection) ? savedSection : currentPath,
    sessionRestored: hasSavedData,
    user: { ...DEFAULT_STATE.user, ...saved.user },
    settings: { ...DEFAULT_STATE.settings, ...saved.settings },
    stats: { ...DEFAULT_STATE.stats, ...saved.stats },
    activityLog: loadActivityLog(),
  });
  const router = createAppRouter(store);

  useEffect(() => {
    const applyTheme = (): void => {
      document.documentElement.dataset.theme = store.getState().settings.theme;
    };
    applyTheme();
    store.subscribe(applyTheme);

    persistStore(store);
    persistActivityLog(store);
    persistCurrentSection(store);
  }, []);

  return (
    <RouterProvider router={router} />
  );
}