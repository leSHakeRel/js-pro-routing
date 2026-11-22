import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore } from '../../store/store';
import { DEFAULT_STATE } from '../../types';
import { SettingsPage } from '../Settings';

describe('Settings page', () => {
  const store = createStore({ ...DEFAULT_STATE });

  beforeEach(() => {
    store.setState({ ...DEFAULT_STATE });
  });

  it('должен рендерить заголовок страницы', () => {
    render(<SettingsPage store={store} />);
    expect(screen.getByText('Настройки')).toBeTruthy();
  });

  it('должен рендерить форму', () => {
    render(<SettingsPage store={store} />);
    const form = document.querySelector('form#settings-form');
    expect(form).not.toBeNull();
  });

  it('должен содержать поле имени', () => {
    render(<SettingsPage store={store} />);
    const nameInput = document.querySelector<HTMLInputElement>('[name="name"]');
    expect(nameInput).not.toBeNull();
    expect(nameInput?.value).toBe('Гость');
  });

  it('должен содержать поле email', () => {
    render(<SettingsPage store={store} />);
    const emailInput = document.querySelector<HTMLInputElement>('[name="email"]');
    expect(emailInput).not.toBeNull();
  });

  it('должен содержать поле темы оформления', () => {
    render(<SettingsPage store={store} />);
    const themeSelect = document.querySelector<HTMLSelectElement>('[name="theme"]');
    expect(themeSelect).not.toBeNull();
    expect(themeSelect?.value).toBe('light');
  });

  it('должен содержать кнопку сохранения', () => {
    render(<SettingsPage store={store} />);
    const submitBtn = document.querySelector<HTMLButtonElement>('button[type="submit"]');
    expect(submitBtn).not.toBeNull();
    expect(submitBtn?.textContent).toBe('Сохранить');
  });

  it('должен содержать все поля формы: имя, email, тему, язык, уведомления', () => {
    render(<SettingsPage store={store} />);

    expect(document.querySelector<HTMLInputElement>('[name="name"]')).not.toBeNull();
    expect(document.querySelector<HTMLInputElement>('[name="email"]')).not.toBeNull();
    expect(document.querySelector<HTMLSelectElement>('[name="theme"]')).not.toBeNull();
    expect(document.querySelector<HTMLSelectElement>('[name="language"]')).not.toBeNull();
    expect(document.querySelector<HTMLInputElement>('[name="notifications"]')).not.toBeNull();
  });

  it('должен изменять имя через userEvent.clear + userEvent.type', async () => {
    const user = userEvent.setup();
    render(<SettingsPage store={store} />);

    const nameInput = screen.getByDisplayValue('Гость');
    await user.clear(nameInput);
    await user.type(nameInput, 'Иван Петров');

    expect(nameInput).toHaveValue('Иван Петров');
  });

  it('должен изменять тему оформления через select', async () => {
    const user = userEvent.setup();
    render(<SettingsPage store={store} />);

    const themeSelect = screen.getByLabelText('Тема оформления');
    expect(themeSelect).toHaveValue('light');

    await user.selectOptions(themeSelect, 'dark');
    expect(themeSelect).toHaveValue('dark');
  });

  it('должен изменять язык через select', async () => {
    const user = userEvent.setup();
    render(<SettingsPage store={store} />);

    const languageSelect = screen.getByLabelText('Язык');
    expect(languageSelect).toHaveValue('ru');

    await user.selectOptions(languageSelect, 'en');
    expect(languageSelect).toHaveValue('en');
  });

  it('должен переключать уведомления через чекбокс', async () => {
    const user = userEvent.setup();
    render(<SettingsPage store={store} />);

    const notificationsCheckbox = screen.getByLabelText('Присылать уведомления');
    expect(notificationsCheckbox).toBeChecked();

    await user.click(notificationsCheckbox);
    expect(notificationsCheckbox).not.toBeChecked();

    await user.click(notificationsCheckbox);
    expect(notificationsCheckbox).toBeChecked();
  });

  it('должен сохранять изменения в store при сабмите формы', async () => {
    const user = userEvent.setup();
    render(<SettingsPage store={store} />);

    const nameInput = screen.getByDisplayValue('Гость');
    await user.clear(nameInput);
    await user.type(nameInput, 'Иван Петров');

    const themeSelect = screen.getByLabelText('Тема оформления');
    await user.selectOptions(themeSelect, 'dark');

    const languageSelect = screen.getByLabelText('Язык');
    await user.selectOptions(languageSelect, 'en');

    const notificationsCheckbox = screen.getByLabelText('Присылать уведомления');
    await user.click(notificationsCheckbox);

    const submitBtn = screen.getByText('Сохранить');
    await user.click(submitBtn);

    const state = store.getState();
    expect(state.user.name).toBe('Иван Петров');
    expect(state.settings.theme).toBe('dark');
    expect(state.settings.language).toBe('en');
    expect(state.settings.notifications).toBe(false);

    expect(screen.getByText('✓ Сохранено в глобальный store и localStorage')).toBeTruthy();
  });

  it('должен быть предзаполнен текущими значениями из store', () => {
    store.setState({
      user: { name: 'Тестовый Пользователь', email: 'test@example.com', bio: 'Тестовая биография' },
      settings: { theme: 'dark', language: 'en', notifications: false },
    });

    render(<SettingsPage store={store} />);

    const nameInput = document.querySelector<HTMLInputElement>('[name="name"]');
    expect(nameInput?.value).toBe('Тестовый Пользователь');

    const emailInput = document.querySelector<HTMLInputElement>('[name="email"]');
    expect(emailInput?.value).toBe('test@example.com');

    const themeSelect = document.querySelector<HTMLSelectElement>('[name="theme"]');
    expect(themeSelect?.value).toBe('dark');

    const languageSelect = document.querySelector<HTMLSelectElement>('[name="language"]');
    expect(languageSelect?.value).toBe('en');

    const notificationsCheckbox = document.querySelector<HTMLInputElement>('[name="notifications"]');
    expect(notificationsCheckbox?.checked).toBe(false);
  });
});