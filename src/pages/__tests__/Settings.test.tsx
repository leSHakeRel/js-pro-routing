import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});