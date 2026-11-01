import type { RenderedPage } from '../router/router';
import type { Store } from '../store/store';
import { createBadge, createCard, createRow } from '../components/ui';

/**
 * Главная страница (/).
 */
export function renderHome(store: Store): RenderedPage {
  const section = document.createElement('section');
  section.className = 'page';

  const h1 = document.createElement('h1');
  h1.textContent = 'Главная';

  const subtitle = document.createElement('p');
  subtitle.className = 'subtitle';
  subtitle.textContent = 'Сводка глобального состояния приложения.';

  const card = createCard('Текущее состояние');
  section.append(h1, subtitle, card);

  const renderContent = (): void => {
    const { user, settings, stats } = store.getState();

    card.replaceChildren();

    const greeting = document.createElement('p');
    greeting.className = 'greeting';
    greeting.textContent = `Привет, ${user.name || 'Гость'}!`;
    greeting.appendChild(createBadge(settings.theme === 'dark' ? '🌙 Тёмная тема' : '☀️ Светлая тема'));

    card.append(
      greeting,
      createRow('Имя', user.name || '—'),
      createRow('Email', user.email || '—'),
      createRow('Язык', settings.language),
      createRow('Уведомления', settings.notifications ? 'Включены' : 'Выключены'),
      createRow('Посещений', String(stats.visits)),
    );
  };

  renderContent();
  const unsubscribe = store.subscribe(renderContent);

  return { element: section, cleanup: unsubscribe };
}