import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Store } from '../store/store';
import type { ActionType, ActionLogEntry } from '../types';
import { useStore } from '../hooks/useStoreSubscription';
import { PageLayout } from '../hooks/usePageLayout';

/** Типы действий */
const ACTION_LABELS: Record<ActionType, string> = {
  navigation: 'Навигация',
  settings_save: 'Настройки',
  contact_send: 'Сообщение',
};

/** Иконки для типов действий */
const ACTION_ICONS: Record<ActionType, string> = {
  navigation: '➡️',
  settings_save: '⚙️',
  contact_send: '✉️',
};

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ru-RU');
  } catch {
    return iso;
  }
}

/** Строка лога */
function LogRow({ entry, index }: { entry: ActionLogEntry; index: number }): ReactNode {
  return (
    <div className="log-row">
      <span className="log-num">{index + 1}</span>
      <span className="log-icon">{ACTION_ICONS[entry.type] || '📋'}</span>
      <span className="log-desc">{entry.description}</span>
      <span className="log-type">{ACTION_LABELS[entry.type] || entry.type}</span>
      <span className="log-time">{formatTimestamp(entry.timestamp)}</span>
    </div>
  );
}

/** Фильтр по типу действия */
function Filter({ current, onChange }: {
  current: ActionType | 'all';
  onChange: (type: ActionType | 'all') => void;
}): ReactNode {
  const types: Array<{ type: ActionType; label: string }> = [
    { type: 'navigation', label: 'Навигация' },
    { type: 'settings_save', label: 'Настройки' },
    { type: 'contact_send', label: 'Сообщения' },
  ];

  return (
    <div className="log-filters">
      <button
        className={`btn btn-filter${current === 'all' ? ' active' : ''}`}
        data-filter="all"
        onClick={() => onChange('all')}
      >
        Все
      </button>
      {types.map(({ type, label }) => (
        <button
          key={type}
          className={`btn btn-filter${current === type ? ' active' : ''}`}
          data-filter={type}
          onClick={() => onChange(type)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

/**
 * Страница «Лог активности» (/activity-log).
 */
export function ActivityLogPage({ store }: { store: Store }): ReactNode {
  const { activityLog } = useStore(store);
  const [currentFilter, setCurrentFilter] = useState<ActionType | 'all'>('all');

  const filtered = currentFilter === 'all'
    ? activityLog
    : activityLog.filter((entry) => entry.type === currentFilter);

  const recent = filtered.slice(-50).reverse();

  return (
    <PageLayout
      title="Лог активности"
      subtitle="История действий пользователя в приложении."
    >
      <Filter current={currentFilter} onChange={setCurrentFilter} />

      <div className="log-container">
        {recent.length === 0 ? (
          <p className="log-empty">
            {currentFilter === 'all'
              ? 'Лог активности пуст. Совершите какие-нибудь действия в приложении.'
              : 'Нет записей выбранного типа.'}
          </p>
        ) : (
          recent.map((entry, i) => (
            <LogRow key={entry.id} entry={entry} index={i} />
          ))
        )}
      </div>
    </PageLayout>
  );
}