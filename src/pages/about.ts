import type { RenderedPage } from '../router/router';
import type { Store } from '../store/store';
import { createCard, createRow } from '../components/ui';

/**
 * Страница «О приложении» (/about).
 */
export function renderAbout(store: Store): RenderedPage {
  const section = document.createElement('section');
  section.className = 'page';

  const h1 = document.createElement('h1');
  h1.textContent = 'О приложении';

  const subtitle = document.createElement('p');
  subtitle.className = 'subtitle';
  subtitle.textContent = 'Mini-SPA на TypeScript';

  const card = createCard('Данные из глобального store');
  section.append(h1, subtitle, card);

  const renderContent = (): void => {
    const { user, settings } = store.getState();

    card.replaceChildren();

    const note = document.createElement('p');
    note.className = 'note';
    note.textContent = 'Данные обновляются автоматически — приходят из общего состояния';

    card.append(
      note,
      createRow('Имя', user.name || '—'),
      createRow('Email', user.email || '—'),
      createRow('Тема', settings.theme === 'dark' ? 'Тёмная' : 'Светлая'),
      createRow('Язык', settings.language),
      createRow('Уведомления', settings.notifications ? 'Включены' : 'Выключены'),
    );
  };

  renderContent();
  const unsubscribe = store.subscribe(renderContent);

  return { element: section, cleanup: unsubscribe };
}