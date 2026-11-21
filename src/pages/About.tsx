import type { ReactNode } from 'react';
import type { Store } from '../store/store';
import { useStore } from '../hooks/useStoreSubscription';
import { PageLayout } from '../hooks/usePageLayout';
import { Row } from '../components/ui';

/**
 * Страница «О приложении» (/about).
 */
export function AboutPage({ store }: { store: Store }): ReactNode {
  const { user, settings } = useStore(store);

  return (
    <PageLayout
      title="О приложении"
      subtitle="Mini-SPA на React + TypeScript"
      cardTitle="Данные из глобального store"
    >
      <p className="note">
        Данные обновляются автоматически — приходят из общего состояния
      </p>
      <Row label="Имя" value={user.name || '—'} />
      <Row label="Email" value={user.email || '—'} />
      <Row label="Тема" value={settings.theme === 'dark' ? 'Тёмная' : 'Светлая'} />
      <Row label="Язык" value={settings.language} />
      <Row label="Уведомления" value={settings.notifications ? 'Включены' : 'Выключены'} />
    </PageLayout>
  );
}