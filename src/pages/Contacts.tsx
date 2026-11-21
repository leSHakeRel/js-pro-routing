import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Store } from '../store/store';
import { PageLayout } from '../hooks/usePageLayout';
import { useFormHandler } from '../hooks/useFormHandler';

/**
 * Страница «Контакты» (/contacts) — форма обратной связи.
 */
export function ContactsPage({ store }: { store: Store }): ReactNode {
  const [status, setStatus] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  const formHandler = useFormHandler(store, {
    formSelector: '#contacts-form',
    fields: {
      name: (v) => v.trim(),
      email: (v) => v.trim(),
      message: (v) => v.trim(),
    },
  });

  const isValidEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    setErrors([]);

    const values = formHandler.getValues();
    const fieldErrors: string[] = [];

    if (!values.name || String(values.name).length < 2) {
      fieldErrors.push('Имя должно содержать минимум 2 символа');
    }

    if (!values.email || !isValidEmail(String(values.email))) {
      fieldErrors.push('Укажите корректный email');
    }

    if (!values.message || String(values.message).length < 10) {
      fieldErrors.push('Сообщение должно содержать минимум 10 символов');
    }

    if (fieldErrors.length > 0) {
      setErrors(fieldErrors);
      setStatus('✗ Исправьте ошибки в форме');
      return;
    }

    const { contacts, activityLog } = store.getState();
    const newMessage = {
      name: String(values.name),
      email: String(values.email),
      message: String(values.message),
      timestamp: new Date().toISOString(),
    };

    store.setState({
      contacts: [...contacts, newMessage],
      activityLog: [
        ...activityLog,
        {
          id: crypto.randomUUID(),
          type: 'contact_send' as const,
          description: `Отправлено сообщение от ${values.name}`,
          timestamp: new Date().toISOString(),
        },
      ],
    });

    formHandler.setValues({ name: '', email: '', message: '' });
    setStatus('✓ Сообщение отправлено!');
  };

  return (
    <PageLayout
      title="Контакты"
      subtitle="Обратная связь — отправьте нам сообщение."
      cardTitle="Форма обратной связи"
    >
      <form className="form" id="contacts-form" noValidate onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="contact-name">Имя *</label>
          <input id="contact-name" name="name" type="text" required placeholder="Ваше имя" />
        </div>

        <div className="field">
          <label htmlFor="contact-email">Email *</label>
          <input id="contact-email" name="email" type="email" required placeholder="you@example.com" />
        </div>

        <div className="field">
          <label htmlFor="contact-message">Сообщение *</label>
          <textarea id="contact-message" name="message" required placeholder="Ваше сообщение..." rows={5} />
        </div>

        <button type="submit" className="btn btn-primary">Отправить</button>

        {status && (
          <p className="form-status" role="status">{status}</p>
        )}

        {errors.length > 0 && (
          <ul className="form-errors" role="alert">
            {errors.map((err, i) => <li key={i}>{err}</li>)}
          </ul>
        )}
      </form>
    </PageLayout>
  );
}