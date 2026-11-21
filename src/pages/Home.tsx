import type { ReactNode } from 'react';
import type { Store } from '../store/store';
import { useStore } from '../hooks/useStoreSubscription';
import { PageLayout } from '../hooks/usePageLayout';
import { Badge, Row } from '../components/ui';

/**
 * Главная страница (/).
 * Демонстрирует использование хуков useStore и PageLayout.
 */
export function HomePage({ store }: { store: Store }): ReactNode {
  const { user, settings, stats } = useStore(store);

  return (
    <PageLayout
      title="Главная"
      subtitle="Сводка глобального состояния приложения."
      cardTitle="Текущее состояние"
    >
      <p className="greeting">
        Привет, {user.name || 'Гость'}!
        <Badge text={settings.theme === 'dark' ? '🌙 Тёмная тема' : '☀️ Светлая тема'} />
      </p>
      <Row label="Имя" value={user.name || '—'} />
      <Row label="Email" value={user.email || '—'} />
      <Row label="Язык" value={settings.language} />
      <Row label="Уведомления" value={settings.notifications ? 'Включены' : 'Выключены'} />
      <Row label="Посещений" value={String(stats.visits)} />
    </PageLayout>
  );
}