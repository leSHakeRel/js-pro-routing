import type { RenderedPage } from '../router/router';
import type { Store } from '../store/store';
import { createCard, createRow, createStat } from '../components/ui';

function formatDate(iso: string): string {
  if (!iso) {
    return '—';
  }
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('ru-RU');
}

/**
 * Дашборд (/dashboard)
 */
export function renderDashboard(store: Store): RenderedPage {
  const section = document.createElement('section');
  section.className = 'page';

  const h1 = document.createElement('h1');
  h1.textContent = 'Дашборд';

  const subtitle = document.createElement('p');
  subtitle.className = 'subtitle';
  subtitle.textContent = 'Агрегированная статистика из единого глобального состояния.';

  const statsGrid = document.createElement('div');
  statsGrid.className = 'stats-grid';

  const profileCard = createCard('Профиль');
  const settingsCard = createCard('Настройки');

  section.append(h1, subtitle, statsGrid, profileCard, settingsCard);

  const renderContent = (): void => {
    const { user, settings, stats } = store.getState();

    statsGrid.replaceChildren(
      createStat(String(stats.visits), 'Посещений'),
      createStat(settings.theme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая', 'Тема'),
      createStat(settings.notifications ? 'Вкл' : 'Выкл', 'Уведомления'),
    );

    profileCard.replaceChildren(
      createRow('Имя', user.name || '—'),
      createRow('Email', user.email || '—'),
      createRow('О себе', user.bio || '—'),
    );

    settingsCard.replaceChildren(
      createRow('Тема', settings.theme === 'dark' ? 'Тёмная' : 'Светлая'),
      createRow('Язык', settings.language),
      createRow('Последний визит', formatDate(stats.lastVisit)),
    );
  };

  renderContent();
  const unsubscribe = store.subscribe(renderContent);

  return { element: section, cleanup: unsubscribe };
}