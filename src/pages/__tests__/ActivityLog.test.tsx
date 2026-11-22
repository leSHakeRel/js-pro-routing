import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createStore } from '../../store/store';
import { DEFAULT_STATE } from '../../types';
import { ActivityLogPage } from '../ActivityLog';
import type { ActionLogEntry } from '../../types';

const mockEntries: ActionLogEntry[] = [
  {
    id: '1',
    type: 'navigation',
    description: 'Переход на страницу Dashboard',
    timestamp: '2026-11-20T10:00:00.000Z',
  },
  {
    id: '2',
    type: 'settings_save',
    description: 'Сохранение настроек темы',
    timestamp: '2026-11-20T11:30:00.000Z',
  },
  {
    id: '3',
    type: 'contact_send',
    description: 'Отправка сообщения в поддержку',
    timestamp: '2026-11-21T09:15:00.000Z',
  },
  {
    id: '4',
    type: 'navigation',
    description: 'Переход на страницу Контакты',
    timestamp: '2026-11-21T14:45:00.000Z',
  },
];

describe('ActivityLog page', () => {
  const store = createStore({ ...DEFAULT_STATE });

  beforeEach(() => {
    store.setState({ ...DEFAULT_STATE });
  });

  it('должен рендерить заголовок страницы "Лог активности"', () => {
    render(<ActivityLogPage store={store} />);
    expect(screen.getByText('Лог активности')).toBeTruthy();
  });

  it('должен рендерить подзаголовок', () => {
    render(<ActivityLogPage store={store} />);
    expect(
      screen.getByText('История действий пользователя в приложении.'),
    ).toBeTruthy();
  });

  it('должен отображать пустое состояние когда нет активностей', () => {
    render(<ActivityLogPage store={store} />);
    expect(
      screen.getByText('Лог активности пуст. Совершите какие-нибудь действия в приложении.'),
    ).toBeTruthy();
  });

  it('должен отображать кнопки фильтра', () => {
    render(<ActivityLogPage store={store} />);
    expect(screen.getByText('Все')).toBeTruthy();
    expect(screen.getByText('Навигация')).toBeTruthy();
    expect(screen.getByText('Настройки')).toBeTruthy();
    expect(screen.getByText('Сообщения')).toBeTruthy();
  });

  it('должен рендерить список активностей', () => {
    store.setState({ activityLog: mockEntries });
    render(<ActivityLogPage store={store} />);
    expect(screen.getByText('Переход на страницу Dashboard')).toBeTruthy();
    expect(screen.getByText('Сохранение настроек темы')).toBeTruthy();
    expect(screen.getByText('Отправка сообщения в поддержку')).toBeTruthy();
    expect(screen.getByText('Переход на страницу Контакты')).toBeTruthy();
  });

  it('должен отображать даты активностей', () => {
    store.setState({ activityLog: mockEntries });
    render(<ActivityLogPage store={store} />);
    expect(screen.getByText('20.11.2026, 13:00:00')).toBeTruthy();
    expect(screen.getByText('21.11.2026, 12:15:00')).toBeTruthy();
  });

  it('должен отображать типы активностей', () => {
    store.setState({ activityLog: mockEntries });
    render(<ActivityLogPage store={store} />);
    const navTypes = screen.getAllByText('Навигация');
    expect(navTypes.length).toBeGreaterThanOrEqual(2);
    const settingsTypes = screen.getAllByText('Настройки');
    expect(settingsTypes.length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText('Сообщение')).toBeTruthy();
  });

  it('должен отображать номера записей', () => {
    store.setState({ activityLog: mockEntries });
    render(<ActivityLogPage store={store} />);
    const logNums = document.querySelectorAll('.log-num');
    expect(logNums.length).toBe(4);
    expect(logNums[0]?.textContent).toBe('1');
    expect(logNums[3]?.textContent).toBe('4');
  });

  it('должен отображать иконки для типов действий', () => {
    store.setState({ activityLog: mockEntries });
    render(<ActivityLogPage store={store} />);
    const logIcons = document.querySelectorAll('.log-icon');
    expect(logIcons.length).toBe(4);
    // Записи выводятся в обратном порядке (reversed)
    expect(logIcons[0]?.textContent).toBe('➡️'); // navigation (последняя запись)
    expect(logIcons[1]?.textContent).toBe('✉️'); // contact_send
    expect(logIcons[2]?.textContent).toBe('⚙️'); // settings_save
    expect(logIcons[3]?.textContent).toBe('➡️'); // navigation (первая запись)
  });

  it('должен фильтровать активности по типу "Навигация"', async () => {
    const user = userEvent.setup();
    store.setState({ activityLog: mockEntries });
    render(<ActivityLogPage store={store} />);

    await user.click(screen.getAllByText('Навигация')[0]);

    expect(screen.getByText('Переход на страницу Dashboard')).toBeTruthy();
    expect(screen.getByText('Переход на страницу Контакты')).toBeTruthy();
    expect(screen.queryByText('Сохранение настроек темы')).toBeNull();
    expect(screen.queryByText('Отправка сообщения в поддержку')).toBeNull();
  });

  it('должен фильтровать активности по типу "Настройки"', async () => {
    const user = userEvent.setup();
    store.setState({ activityLog: mockEntries });
    render(<ActivityLogPage store={store} />);

    await user.click(screen.getAllByText('Настройки')[0]);

    expect(screen.getByText('Сохранение настроек темы')).toBeTruthy();
    expect(screen.queryByText('Переход на страницу Dashboard')).toBeNull();
    expect(screen.queryByText('Отправка сообщения в поддержку')).toBeNull();
  });

  it('должен фильтровать активности по типу "Сообщения"', async () => {
    const user = userEvent.setup();
    store.setState({ activityLog: mockEntries });
    render(<ActivityLogPage store={store} />);

    await user.click(screen.getByText('Сообщения'));

    expect(screen.getByText('Отправка сообщения в поддержку')).toBeTruthy();
    expect(screen.queryByText('Переход на страницу Dashboard')).toBeNull();
    expect(screen.queryByText('Сохранение настроек темы')).toBeNull();
  });

  it('должен показывать "Нет записей выбранного типа" если фильтр не дал результатов', async () => {
    const user = userEvent.setup();
    store.setState({
      activityLog: [mockEntries[0]], // только navigation
    });
    render(<ActivityLogPage store={store} />);

    await user.click(screen.getAllByText('Настройки')[0]);

    expect(
      screen.getByText('Нет записей выбранного типа.'),
    ).toBeTruthy();
  });

  it('должен сбрасывать фильтр при нажатии "Все"', async () => {
    const user = userEvent.setup();
    store.setState({ activityLog: mockEntries });
    render(<ActivityLogPage store={store} />);

    await user.click(screen.getAllByText('Настройки')[0]);
    expect(screen.queryByText('Переход на страницу Dashboard')).toBeNull();

    await user.click(screen.getByText('Все'));
    expect(screen.getByText('Переход на страницу Dashboard')).toBeTruthy();
    expect(screen.getByText('Сохранение настроек темы')).toBeTruthy();
  });

  it('должен отображать активности в обратном хронологическом порядке', () => {
    store.setState({ activityLog: mockEntries });
    render(<ActivityLogPage store={store} />);

    const logNums = document.querySelectorAll('.log-num');
    // Последние 50 записей в обратном порядке: 4, 3, 2, 1
    expect(logNums[0]?.textContent).toBe('1');
    expect(logNums[1]?.textContent).toBe('2');
    expect(logNums[2]?.textContent).toBe('3');
    expect(logNums[3]?.textContent).toBe('4');
  });

  it('должен подсвечивать активный фильтр классом active', async () => {
    const user = userEvent.setup();
    store.setState({ activityLog: mockEntries });
    render(<ActivityLogPage store={store} />);

    const allBtn = screen.getByText('Все');
    expect(allBtn.classList.contains('active')).toBe(true);

    const navFilterBtn = screen.getAllByText('Навигация')[0];
    await user.click(navFilterBtn);
    expect(allBtn.classList.contains('active')).toBe(false);
    expect(navFilterBtn.classList.contains('active')).toBe(true);
  });
});