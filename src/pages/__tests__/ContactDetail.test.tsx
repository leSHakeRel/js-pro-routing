import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore } from '../../store/store';
import { DEFAULT_STATE } from '../../types';
import { ContactDetailPage } from '../ContactDetail';
import type { ContactMessage } from '../../types';

// Мокаем useParams из react-router
const mockUseParams = vi.fn();
vi.mock('react-router', () => ({
  useParams: () => mockUseParams(),
  Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
    <a href={to}>{children}</a>
  ),
}));

const mockContact: ContactMessage = {
  name: 'Иван Петров',
  email: 'ivan@example.com',
  message: 'Тестовое сообщение',
  timestamp: '2026-11-20T10:30:00.000Z',
};

describe('ContactDetail page', () => {
  const store = createStore({ ...DEFAULT_STATE });

  beforeEach(() => {
    store.setState({ ...DEFAULT_STATE });
    mockUseParams.mockReturnValue({ id: '0' });
  });

  it('должен рендерить заголовок страницы "Детали контакта"', () => {
    store.setState({ contacts: [mockContact] });
    render(<ContactDetailPage store={store} />);
    expect(screen.getByText('Детали контакта')).toBeTruthy();
  });

  it('должен рендерить подзаголовок с номером контакта', () => {
    store.setState({ contacts: [mockContact] });
    render(<ContactDetailPage store={store} />);
    expect(screen.getByText('Просмотр контакта #0')).toBeTruthy();
  });

  it('должен отображать имя контакта в заголовке карточки', () => {
    store.setState({ contacts: [mockContact] });
    render(<ContactDetailPage store={store} />);
    expect(screen.getByText('Иван Петров')).toBeTruthy();
  });

  it('должен отображать email контакта', () => {
    store.setState({ contacts: [mockContact] });
    render(<ContactDetailPage store={store} />);
    expect(screen.getByText('ivan@example.com')).toBeTruthy();
  });

  it('должен отображать сообщение контакта', () => {
    store.setState({ contacts: [mockContact] });
    render(<ContactDetailPage store={store} />);
    expect(screen.getByText('Тестовое сообщение')).toBeTruthy();
  });

  it('должен отображать дату отправки контакта', () => {
    store.setState({ contacts: [mockContact] });
    render(<ContactDetailPage store={store} />);
    expect(screen.getByText('20.11.2026, 13:30:00')).toBeTruthy();
  });

  it('должен отображать ссылку "← Все контакты"', () => {
    store.setState({ contacts: [mockContact] });
    render(<ContactDetailPage store={store} />);
    const link = screen.getByText('← Все контакты');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/contacts');
  });

  it('должен отображать сообщение "Контакт не найден" если контакт отсутствует', () => {
    render(<ContactDetailPage store={store} />);
    expect(screen.getByText('Контакт не найден')).toBeTruthy();
  });

  it('должен отображать идентификатор ненайденного контакта', () => {
    mockUseParams.mockReturnValue({ id: '99' });
    render(<ContactDetailPage store={store} />);
    expect(screen.getByText(/«99»/)).toBeTruthy();
  });

  it('должен отображать ссылку "← Вернуться к списку контактов" если контакт не найден', () => {
    render(<ContactDetailPage store={store} />);
    const link = screen.getByText('← Вернуться к списку контактов');
    expect(link).toBeTruthy();
    expect(link.getAttribute('href')).toBe('/contacts');
  });

  it('должен отображать прочерк если id не передан', () => {
    mockUseParams.mockReturnValue({ id: undefined });
    render(<ContactDetailPage store={store} />);
    expect(screen.getByText(/«—»/)).toBeTruthy();
  });

  it('должен корректно отображать данные второго контакта', () => {
    const secondContact: ContactMessage = {
      name: 'Анна Смирнова',
      email: 'anna@example.com',
      message: 'Второе сообщение',
      timestamp: '2026-11-21T15:00:00.000Z',
    };
    store.setState({ contacts: [mockContact, secondContact] });
    mockUseParams.mockReturnValue({ id: '1' });
    render(<ContactDetailPage store={store} />);
    expect(screen.getByText('Анна Смирнова')).toBeTruthy();
    expect(screen.getByText('anna@example.com')).toBeTruthy();
    expect(screen.getByText('Второе сообщение')).toBeTruthy();
  });
});