import type { RenderedPage } from '../router/router';
import type { Store } from '../store/store';
import { createCard } from '../components/ui';

/** Создать текстовое  поле */
function textField(
  label: string,
  name: string,
  value: string,
  placeholder: string,
  type: 'text' | 'email' = 'text',
): HTMLElement {
  const field = document.createElement('div');
  field.className = 'field';

  const labelEl = document.createElement('label');
  labelEl.htmlFor = `field-${name}`;
  labelEl.textContent = label;

  const input = document.createElement('input');
  input.id = `field-${name}`;
  input.name = name;
  input.type = type;
  input.value = value;
  input.placeholder = placeholder;

  field.append(labelEl, input);
  return field;
}

/** Создать многострочное поле */
function textareaField(label: string, name: string, value: string, placeholder: string): HTMLElement {
  const field = document.createElement('div');
  field.className = 'field';

  const labelEl = document.createElement('label');
  labelEl.htmlFor = `field-${name}`;
  labelEl.textContent = label;

  const textarea = document.createElement('textarea');
  textarea.id = `field-${name}`;
  textarea.name = name;
  textarea.placeholder = placeholder;
  textarea.rows = 3;
  textarea.value = value;

  field.append(labelEl, textarea);
  return field;
}

/** Создать выпадающий список */
function selectField(
  label: string,
  name: string,
  options: ReadonlyArray<{ value: string; label: string }>,
  selected: string,
): HTMLElement {
  const field = document.createElement('div');
  field.className = 'field';

  const labelEl = document.createElement('label');
  labelEl.htmlFor = `field-${name}`;
  labelEl.textContent = label;

  const select = document.createElement('select');
  select.id = `field-${name}`;
  select.name = name;

  for (const option of options) {
    const optionEl = document.createElement('option');
    optionEl.value = option.value;
    optionEl.textContent = option.label;
    optionEl.selected = option.value === selected;
    select.appendChild(optionEl);
  }

  field.append(labelEl, select);
  return field;
}

/** Создать чекбокс */
function checkboxField(label: string, name: string, checked: boolean): HTMLElement {
  const field = document.createElement('div');
  field.className = 'field';

  const labelEl = document.createElement('label');
  labelEl.className = 'checkbox';

  const input = document.createElement('input');
  input.type = 'checkbox';
  input.name = name;
  input.checked = checked;

  const text = document.createElement('span');
  text.textContent = label;

  labelEl.append(input, text);
  field.appendChild(labelEl);
  return field;
}

/**
 * Страница настроек (/settings).
 */
export function renderSettings(store: Store): RenderedPage {
  const section = document.createElement('section');
  section.className = 'page';

  const h1 = document.createElement('h1');
  h1.textContent = 'Настройки';

  const subtitle = document.createElement('p');
  subtitle.className = 'subtitle';
  subtitle.textContent = 'Данные формы сохраняются в глобальный store; настройки — ещё и в localStorage.';

  const card = createCard('Профиль и предпочтения');
  section.append(h1, subtitle, card);

  const state = store.getState();

  const form = document.createElement('form');
  form.className = 'form';
  form.id = 'settings-form';

  form.append(
    textField('Имя', 'name', state.user.name, 'Как к вам обращаться'),
    textField('Email', 'email', state.user.email, 'you@example.com', 'email'),
    textareaField('О себе', 'bio', state.user.bio, 'Пара слов о вас'),
    selectField(
      'Тема оформления',
      'theme',
      [
        { value: 'light', label: '☀️ Светлая' },
        { value: 'dark', label: '🌙 Тёмная' },
      ],
      state.settings.theme,
    ),
    selectField(
      'Язык',
      'language',
      [
        { value: 'ru', label: 'Русский' },
        { value: 'en', label: 'English' },
      ],
      state.settings.language,
    ),
    checkboxField('Присылать уведомления', 'notifications', state.settings.notifications),
  );

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'btn btn-primary';
  submit.textContent = 'Сохранить';
  form.appendChild(submit);

  const status = document.createElement('p');
  status.className = 'form-status';
  status.setAttribute('role', 'status');
  form.appendChild(status);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);

    store.setState({
      user: {
        name: String(data.get('name') ?? '').trim(),
        email: String(data.get('email') ?? '').trim(),
        bio: String(data.get('bio') ?? '').trim(),
      },
      settings: {
        theme: data.get('theme') === 'dark' ? 'dark' : 'light',
        language: String(data.get('language') ?? 'ru'),
        notifications: data.get('notifications') === 'on',
      },
    });

    status.textContent = '✓ Сохранено в глобальный store и localStorage';
  });

  card.appendChild(form);
  return { element: section };
}