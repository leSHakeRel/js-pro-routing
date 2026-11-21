import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore } from '../../store/store';
import { DEFAULT_STATE } from '../../types';
import { HomePage } from '../Home';

describe('Home page', () => {
  const store = createStore({ ...DEFAULT_STATE });

  beforeEach(() => {
    store.setState({ ...DEFAULT_STATE });
  });

  it('должен рендерить заголовок страницы', () => {
    render(<HomePage store={store} />);
    expect(screen.getByText('Главная')).toBeTruthy();
  });

  it('должен рендерить подзаголовок', () => {
    render(<HomePage store={store} />);
    expect(screen.getByText('Сводка глобального состояния приложения.')).toBeTruthy();
  });

  it('должен рендерить карточку с состоянием', () => {
    render(<HomePage store={store} />);
    expect(screen.getByText(/Привет/)).toBeTruthy();
    expect(screen.getAllByText(/Гость/).length).toBeGreaterThan(0);
  });

  it('должен отображать имя пользователя из store', () => {
    store.setState({ user: { name: 'Тестовый пользователь', email: '', bio: '' } });
    render(<HomePage store={store} />);
    expect(screen.getAllByText(/Тестовый пользователь/).length).toBeGreaterThan(0);
  });

  it('должен отображать "Гость" если имя не задано', () => {
    render(<HomePage store={store} />);
    const greeting = screen.getByText(/Привет,/);
    expect(greeting.textContent).toContain('Гость');
  });

  it('должен отображать количество посещений', () => {
    store.setState({ stats: { visits: 42, lastVisit: '' } });
    render(<HomePage store={store} />);
    expect(screen.getByText('42')).toBeTruthy();
  });
});