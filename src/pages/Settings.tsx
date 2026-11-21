import type { ReactNode } from 'react';
import { useState } from 'react';
import type { Store } from '../store/store';
import { PageLayout } from '../hooks/usePageLayout';
import { useFormHandler } from '../hooks/useFormHandler';

/** Текстовое поле */
function TextField({ label, name, value, placeholder, type = 'text' }: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
  type?: 'text' | 'email';
}): ReactNode {
  return (
    <div className="field">
      <label htmlFor={`field-${name}`}>{label}</label>
      <input
        id={`field-${name}`}
        name={name}
        type={type}
        defaultValue={value}
        placeholder={placeholder}
      />
    </div>
  );
}

/** Многострочное поле */
function TextareaField({ label, name, value, placeholder }: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
}): ReactNode {
  return (
    <div className="field">
      <label htmlFor={`field-${name}`}>{label}</label>
      <textarea
        id={`field-${name}`}
        name={name}
        defaultValue={value}
        placeholder={placeholder}
        rows={3}
      />
    </div>
  );
}

/** Выпадающий список */
function SelectField({ label, name, options, selected }: {
  label: string;
  name: string;
  options: ReadonlyArray<{ value: string; label: string }>;
  selected: string;
}): ReactNode {
  return (
    <div className="field">
      <label htmlFor={`field-${name}`}>{label}</label>
      <select id={`field-${name}`} name={name} defaultValue={selected}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Чекбокс */
function CheckboxField({ label, name, checked }: {
  label: string;
  name: string;
  checked: boolean;
}): ReactNode {
  return (
    <div className="field">
      <label className="checkbox">
        <input type="checkbox" name={name} defaultChecked={checked} />
        <span>{label}</span>
      </label>
    </div>
  );
}

/**
 * Страница настроек (/settings).
 */
export function SettingsPage({ store }: { store: Store }): ReactNode {
  const [status, setStatus] = useState('');
  const state = store.getState();

  const formHandler = useFormHandler(store, {
    formSelector: '#settings-form',
    fields: {
      name: (v) => v.trim(),
      email: (v) => v.trim(),
      bio: (v) => v.trim(),
      theme: (v) => v === 'dark' ? 'dark' : 'light',
      language: (v) => v || 'ru',
      notifications: (v) => v === 'on',
    },
  });

  const handleSubmit = (event: React.FormEvent): void => {
    event.preventDefault();
    formHandler.save();

    const { activityLog } = store.getState();
    store.setState({
      activityLog: [
        ...activityLog,
        {
          id: crypto.randomUUID(),
          type: 'settings_save',
          description: 'Сохранены настройки профиля',
          timestamp: new Date().toISOString(),
        },
      ],
    });

    setStatus('✓ Сохранено в глобальный store и localStorage');
  };

  return (
    <PageLayout
      title="Настройки"
      subtitle="Данные формы сохраняются в глобальный store; настройки — ещё и в localStorage."
      cardTitle="Профиль и предпочтения"
    >
      <form className="form" id="settings-form" onSubmit={handleSubmit}>
        <TextField
          label="Имя"
          name="name"
          value={state.user.name}
          placeholder="Как к вам обращаться"
        />
        <TextField
          label="Email"
          name="email"
          value={state.user.email}
          placeholder="you@example.com"
          type="email"
        />
        <TextareaField
          label="О себе"
          name="bio"
          value={state.user.bio}
          placeholder="Пара слов о вас"
        />
        <SelectField
          label="Тема оформления"
          name="theme"
          options={[
            { value: 'light', label: '☀️ Светлая' },
            { value: 'dark', label: '🌙 Тёмная' },
          ]}
          selected={state.settings.theme}
        />
        <SelectField
          label="Язык"
          name="language"
          options={[
            { value: 'ru', label: 'Русский' },
            { value: 'en', label: 'English' },
          ]}
          selected={state.settings.language}
        />
        <CheckboxField
          label="Присылать уведомления"
          name="notifications"
          checked={state.settings.notifications}
        />

        <button type="submit" className="btn btn-primary">Сохранить</button>

        {status && (
          <p className="form-status" role="status">{status}</p>
        )}
      </form>
    </PageLayout>
  );
}