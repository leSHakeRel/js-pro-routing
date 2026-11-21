import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router';
import type { Store } from '../store/store';
import { PageLayout } from '../hooks/usePageLayout';
import { Row } from '../components/ui';

/**
 * Страница детального просмотра контакта (/contacts/:id).
 * Демонстрирует параметризованный маршрут React Router.
 */
export function ContactDetailPage({ store }: { store: Store }): ReactNode {
  const params = useParams();
  const contactId = params.id ?? '—';

  const { contacts } = store.getState();
  const contact = contacts[Number(contactId)];

  return (
    <PageLayout
      title="Детали контакта"
      subtitle={`Просмотр контакта #${contactId}`}
      cardTitle={contact ? contact.name : 'Контакт не найден'}
    >
      {contact ? (
        <>
          <Row label="Email" value={contact.email} />
          <Row label="Сообщение" value={contact.message} />
          <Row label="Отправлено" value={new Date(contact.timestamp).toLocaleString('ru-RU')} />
        </>
      ) : (
        <p className="note">
          Контакт с идентификатором «{contactId}» не найден.
          <br />
          <Link to="/contacts">← Вернуться к списку контактов</Link>
        </p>
      )}

      <p className="note" style={{ marginTop: '1rem' }}>
        <Link to="/contacts">← Все контакты</Link>
      </p>
    </PageLayout>
  );
}