import type { ReactNode } from 'react';
import type { Store } from '../store/store';
import { useStore } from '../hooks/useStoreSubscription';
import { PageLayout } from '../hooks/usePageLayout';
import { Card, Row, Stat } from '../components/ui';

function formatDate(iso: string): string {
  if (!iso) return '—';
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('ru-RU');
}

/**
 * Дашборд (/dashboard).
 */
export function DashboardPage({ store }: { store: Store }): ReactNode {
  const { user, settings, stats } = useStore(store);

  return (
    <PageLayout
      title="Дашборд"
      subtitle="Агрегированная статистика из единого глобального состояния."
    >
      <div className="stats-grid">
        <Stat value={String(stats.visits)} label="Посещений" />
        <Stat
          value={settings.theme === 'dark' ? '🌙 Тёмная' : '☀️ Светлая'}
          label="Тема"
        />
        <Stat
          value={settings.notifications ? 'Вкл' : 'Выкл'}
          label="Уведомления"
        />
      </div>

      <Card title="Профиль">
        <Row label="Имя" value={user.name || '—'} />
        <Row label="Email" value={user.email || '—'} />
        <Row label="О себе" value={user.bio || '—'} />
      </Card>

      <Card title="Настройки">
        <Row label="Тема" value={settings.theme === 'dark' ? 'Тёмная' : 'Светлая'} />
        <Row label="Язык" value={settings.language} />
        <Row label="Последний визит" value={formatDate(stats.lastVisit)} />
      </Card>
    </PageLayout>
  );
}