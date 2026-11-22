import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore } from '../../store/store';
import { DEFAULT_STATE } from '../../types';
import { AboutPage } from '../About';

describe('About page', () => {
  const store = createStore({ ...DEFAULT_STATE });

  beforeEach(() => {
    store.setState({ ...DEFAULT_STATE });
  });

  it('должен рендерить заголовок страницы', () => {
    render(<AboutPage store={store} />);
    expect(screen.getByText('О приложении')).toBeTruthy();
  });

  it('должен рендерить подзаголовок', () => {
    render(<AboutPage store={store} />);
    expect(screen.getByText('Mini-SPA на React + TypeScript')).toBeTruthy();
  });

  it('должен рендерить карточку с данными из store', () => {
    render(<AboutPage store={store} />);
    expect(screen.getByText('Данные из глобального store')).toBeTruthy();
  });

  it('должен отображать имя пользователя из store', () => {
    store.setState({ user: { name: 'Иван Петров', email: '', bio: '' } });
    render(<AboutPage store={store} />);
    expect(screen.getByText('Иван Петров')).toBeTruthy();
  });

  it('должен отображать email пользователя из store', () => {
    store.setState({ user: { name: '', email: 'test@example.com', bio: '' } });
    render(<AboutPage store={store} />);
    expect(screen.getByText('test@example.com')).toBeTruthy();
  });

  it('должен отображать тему оформления', () => {
    store.setState({ settings: { theme: 'dark', language: 'ru', notifications: true } });
    render(<AboutPage store={store} />);
    expect(screen.getByText('Тёмная')).toBeTruthy();
  });

  it('должен отображать язык', () => {
    store.setState({ settings: { theme: 'light', language: 'en', notifications: false } });
    render(<AboutPage store={store} />);
    expect(screen.getByText('en')).toBeTruthy();
  });

  it('должен отображать статус уведомлений', () => {
    store.setState({ settings: { theme: 'light', language: 'ru', notifications: true } });
    render(<AboutPage store={store} />);
    expect(screen.getByText('Включены')).toBeTruthy();
  });

  it('должен отображать прочерк если имя не задано', () => {
    store.setState({ user: { name: '', email: '', bio: '' } });
    render(<AboutPage store={store} />);
    const nameRow = screen.getByText('Имя').closest('.row');
    expect(nameRow?.textContent).toContain('—');
  });
});