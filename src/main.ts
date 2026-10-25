import './styles.css';
import { DEFAULT_STATE } from './types';
import { createStore } from './store/store';
import { loadSettings, persistSettings } from './store/persist';
import { Router } from './router/router';
import { createNav, updateNavActive } from './components/nav';
import { renderHome } from './pages/home';
import { renderSettings } from './pages/settings';
import { renderAbout } from './pages/about';
import { renderDashboard } from './pages/dashboard';

const store = createStore({
  ...DEFAULT_STATE,
  settings: { ...DEFAULT_STATE.settings, ...loadSettings() },
});

const applyTheme = (): void => {
  document.documentElement.dataset.theme = store.getState().settings.theme;
};
applyTheme();
store.subscribe(applyTheme);

persistSettings(store);

const app = document.getElementById('app')!;
app.className = 'app';

const header = document.createElement('header');
header.className = 'app-header';

const brand = document.createElement('span');
brand.className = 'brand';
brand.textContent = '⚡ Mini SPA';

const nav = createNav();
header.append(brand, nav);

const main = document.createElement('main');
main.className = 'app-main';
main.id = 'main';

app.append(header, main);

const router = new Router(main, store, {
  onNavigate: (path) => {
    updateNavActive(nav, path);
    const { stats } = store.getState();
    store.setState({
      stats: {
        visits: stats.visits + 1,
        lastVisit: new Date().toISOString(),
      },
    });
  },
});

router
  .addPage({ path: '/', title: 'Главная', render: renderHome })
  .addPage({ path: '/settings', title: 'Настройки', render: renderSettings })
  .addPage({ path: '/about', title: 'О приложении', render: renderAbout })
  .addPage({ path: '/dashboard', title: 'Дашборд', render: renderDashboard });

router.start();