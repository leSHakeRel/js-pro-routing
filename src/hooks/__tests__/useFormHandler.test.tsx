import { describe, it, expect, beforeEach } from 'vitest';
import { createStore } from '../../store/store';
import { DEFAULT_STATE } from '../../types';
import { useFormHandler } from '../useFormHandler';

describe('useFormHandler', () => {
  const store = createStore({ ...DEFAULT_STATE });

  beforeEach(() => {
    store.setState({ ...DEFAULT_STATE });
    document.body.innerHTML = '';
  });

  it('должен корректно получать значения из формы', () => {
    document.body.innerHTML = `
      <form id="test-form">
        <input name="name" value="Тест" />
        <input name="email" value="test@example.com" />
      </form>
    `;
    const handler = useFormHandler(store, {
      formSelector: '#test-form',
      fields: { name: (v) => v.trim(), email: (v) => v.trim() },
    });
    const values = handler.getValues();
    expect(values.name).toBe('Тест');
    expect(values.email).toBe('test@example.com');
  });

  it('должен применять трансформеры к значениям полей', () => {
    document.body.innerHTML = `
      <form id="test-form">
        <input name="name" value="  Иван  " />
        <input name="email" value="  IVAN@EXAMPLE.COM  " />
      </form>
    `;
    const handler = useFormHandler(store, {
      formSelector: '#test-form',
      fields: {
        name: (v) => v.trim(),
        email: (v) => v.trim().toLowerCase(),
      },
    });
    const values = handler.getValues();
    expect(values.name).toBe('Иван');
    expect(values.email).toBe('ivan@example.com');
  });

  it('должен устанавливать значения в форму через setValues', () => {
    document.body.innerHTML = `
      <form id="test-form">
        <input name="name" value="" />
        <input name="email" value="" />
      </form>
    `;
    const handler = useFormHandler(store, {
      formSelector: '#test-form',
      fields: { name: (v) => v, email: (v) => v },
    });
    handler.setValues({ name: 'Новое имя', email: 'new@example.com' });
    const nameInput = document.querySelector<HTMLInputElement>('[name="name"]');
    const emailInput = document.querySelector<HTMLInputElement>('[name="email"]');
    expect(nameInput?.value).toBe('Новое имя');
    expect(emailInput?.value).toBe('new@example.com');
  });

  it('должен сохранять данные в store через save', () => {
    document.body.innerHTML = `
      <form id="test-form">
        <input name="name" value="Сохранённый" />
        <input name="email" value="saved@example.com" />
      </form>
    `;
    const handler = useFormHandler(store, {
      formSelector: '#test-form',
      fields: { name: (v) => v.trim(), email: (v) => v.trim() },
    });
    handler.save();
    const state = store.getState();
    expect(state.user.name).toBe('Сохранённый');
    expect(state.user.email).toBe('saved@example.com');
  });

  it('должен корректно обрабатывать чекбоксы', () => {
    document.body.innerHTML = `
      <form id="test-form">
        <input type="checkbox" name="notifications" checked />
      </form>
    `;
    const handler = useFormHandler(store, {
      formSelector: '#test-form',
      fields: { notifications: (v) => v === 'on' },
    });
    const values = handler.getValues();
    expect(values.notifications).toBe(true);
  });

  it('должен возвращать пустой объект, если форма не найдена', () => {
    const handler = useFormHandler(store, {
      formSelector: '#non-existent-form',
      fields: { name: (v) => v },
    });
    const values = handler.getValues();
    expect(values).toEqual({});
  });
});