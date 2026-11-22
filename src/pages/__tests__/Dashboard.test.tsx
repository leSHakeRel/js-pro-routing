import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore } from '../../store/store';
import { DEFAULT_STATE } from '../../types';
import { DashboardPage } from '../Dashboard';

describe('Dashboard page', () => {
  const store = createStore({ ...DEFAULT_STATE });

  beforeEach(() => {
    store.setState({ ...DEFAULT_STATE });
  });

  it('должен рендерить заголовок страницы', () => {
    render(<DashboardPage store={store} />);
    expect(screen.getByText('Дашборд')).toBeTruthy();
  });

  it('должен рендерить подзаголовок', () => {
    render(<DashboardPage store={store} />);
    expect(
      screen.getByText('Агрегированная статистика из единого глобального состояния.'),
    ).toBeTruthy();
  });

  it('должен рендерить приветствие с именем пользователя из store', () => {
    store.setState({ user: { name: 'Анна', email: 'anna@test.com', bio: 'Bio' } });
    render(<DashboardPage store={store} />);
    expect(screen.getByText('Анна')).toBeTruthy();
  });

  it('должен отображать прочерк если имя не задано', () => {
    store.setState({ user: { name: '', email: '', bio: '' } });
    render(<DashboardPage store={store} />);
    const nameRow = screen.getByText('Имя').closest('.row');
    expect(nameRow?.textContent).toContain('—');
  });

  it('должен отображать email пользователя', () => {
    store.setState({ user: { name: 'Анна', email: 'anna@test.com', bio: 'Bio' } });
    render(<DashboardPage store={store} />);
    expect(screen.getByText('anna@test.com')).toBeTruthy();
  });

  it('должен отображать bio пользователя', () => {
    store.setState({ user: { name: 'Анна', email: 'anna@test.com', bio: 'Full-stack developer' } });
    render(<DashboardPage store={store} />);
    expect(screen.getByText('Full-stack developer')).toBeTruthy();
  });

  it('должен отображать статистику посещений', () => {
    store.setState({ stats: { visits: 128, lastVisit: '' } });
    render(<DashboardPage store={store} />);
    expect(screen.getByText('128')).toBeTruthy();
  });

  it('должен отображать тему в статистике', () => {
    store.setState({ settings: { theme: 'dark', language: 'ru', notifications: true } });
    render(<DashboardPage store={store} />);
    expect(screen.getByText('🌙 Тёмная')).toBeTruthy();
  });

  it('должен отображать статус уведомлений в статистике', () => {
    store.setState({ settings: { theme: 'light', language: 'ru', notifications: true } });
    render(<DashboardPage store={store} />);
    expect(screen.getByText('Вкл')).toBeTruthy();
  });

  it('должен отображать выключенные уведомления', () => {
    store.setState({ settings: { theme: 'light', language: 'ru', notifications: false } });
    render(<DashboardPage store={store} />);
    expect(screen.getByText('Выкл')).toBeTruthy();
  });

  it('должен отображать карточку профиля', () => {
    render(<DashboardPage store={store} />);
    expect(screen.getByText('Профиль')).toBeTruthy();
  });

  it('должен отображать карточку настроек', () => {
    render(<DashboardPage store={store} />);
    expect(screen.getByText('Настройки')).toBeTruthy();
  });

  it('должен отображать язык в карточке настроек', () => {
    store.setState({ settings: { theme: 'light', language: 'en', notifications: false } });
    render(<DashboardPage store={store} />);
    expect(screen.getByText('en')).toBeTruthy();
  });

  it('должен отображать тему в карточке настроек', () => {
    store.setState({ settings: { theme: 'dark', language: 'ru', notifications: true } });
    render(<DashboardPage store={store} />);
    expect(screen.getByText('Тёмная')).toBeTruthy();
  });

  it('должен отображать дату последнего визита', () => {
    store.setState({ stats: { visits: 0, lastVisit: '2026-11-20T10:30:00.000Z' } });
    render(<DashboardPage store={store} />);
    expect(screen.getByText(/20\.11\.2026/)).toBeTruthy();
  });

  it('должен отображать прочерк если дата не указана', () => {
    store.setState({ stats: { visits: 0, lastVisit: '' } });
    render(<DashboardPage store={store} />);
    const lastVisitRow = screen.getByText('Последний визит').closest('.row');
    expect(lastVisitRow?.textContent).toContain('—');
  });
});