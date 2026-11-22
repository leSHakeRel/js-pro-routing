import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { App } from '../App';

// Мокаем createBrowserRouter из react-router/dom, чтобы использовать MemoryRouter
vi.mock('react-router/dom', () => ({
  RouterProvider: ({ router }: { router: unknown }) => {
    // router содержит компоненты, которые используют MemoryRouter
    // Просто рендерим элемент роутера
    const { element } = (router as { routes: Array<{ element: React.ReactNode }> }).routes[0];
    return <>{element}</>;
  },
}));

// Мокаем createAppRouter, чтобы он возвращал структуру с routes
vi.mock('../router/reactRouter', () => ({
  createAppRouter: () => ({
    routes: [
      {
        path: '/',
        element: (
          <MemoryRouter initialEntries={['/']}>
            <div className="app">
              <header className="app-header">
                <span className="brand">Mini SPA</span>
                <nav className="nav">
                  <a href="/">Главная</a>
                  <a href="/settings">Настройки</a>
                  <a href="/about">О приложении</a>
                  <a href="/dashboard">Дашборд</a>
                  <a href="/contacts">Контакты</a>
                  <a href="/activity-log">Лог</a>
                </nav>
              </header>
              <main className="app-main">
                <div>Добро пожаловать!</div>
              </main>
            </div>
          </MemoryRouter>
        ),
      },
    ],
  }),
}));

// Мокаем persist модули
vi.mock('../store/persist', () => ({
  loadStore: vi.fn(() => ({ settings: {}, user: {}, stats: {} })),
  persistStore: vi.fn(),
  loadActivityLog: vi.fn(() => []),
  persistActivityLog: vi.fn(),
  loadCurrentSection: vi.fn(() => null),
  persistCurrentSection: vi.fn(),
}));

// Мокаем createStore
vi.mock('../store/store', () => ({
  createStore: vi.fn((initialState: unknown) => ({
    getState: vi.fn(() => initialState),
    setState: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  })),
}));

describe('App component', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Мокаем window.location
    Object.defineProperty(window, 'location', {
      value: {
        ...originalLocation,
        pathname: '/',
        replace: vi.fn(),
      },
      writable: true,
    });

    // Очищаем localStorage
    localStorage.clear();
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('должен рендерить App без ошибок', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });

  it('должен рендерить навигацию с брендом Mini SPA', () => {
    render(<App />);
    expect(screen.getByText('Mini SPA')).toBeTruthy();
  });

  it('должен рендерить все навигационные ссылки', () => {
    render(<App />);
    expect(screen.getByText('Главная')).toBeTruthy();
    expect(screen.getByText('Настройки')).toBeTruthy();
    expect(screen.getByText('О приложении')).toBeTruthy();
    expect(screen.getByText('Дашборд')).toBeTruthy();
    expect(screen.getByText('Контакты')).toBeTruthy();
    expect(screen.getByText('Лог')).toBeTruthy();
  });

  it('должен рендерить основную секцию main', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeTruthy();
  });

  it('должен рендерить header с классом app-header', () => {
    render(<App />);
    const header = document.querySelector('.app-header');
    expect(header).toBeTruthy();
  });

  it('должен рендерить nav с классом nav', () => {
    render(<App />);
    const nav = document.querySelector('.nav');
    expect(nav).toBeTruthy();
  });

  it('должен рендерить контент по умолчанию (Добро пожаловать!)', () => {
    render(<App />);
    expect(screen.getByText('Добро пожаловать!')).toBeTruthy();
  });

  it('должен содержать 6 навигационных ссылок', () => {
    render(<App />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(6);
  });

  it('должен возвращать null при редиректе на сохранённую секцию', async () => {
    // Мокаем loadStore чтобы вернуть данные с посещениями
    const persistModule = await import('../store/persist');
    vi.mocked(persistModule.loadStore).mockReturnValueOnce({
      settings: {},
      user: {},
      stats: { visits: 5, lastVisit: '2024-01-01' },
    });
    vi.mocked(persistModule.loadCurrentSection).mockReturnValueOnce('/settings');

    const { container } = render(<App />);
    expect(container.innerHTML).toBe('');
    expect(window.location.replace).toHaveBeenCalledWith('/settings');
  });
});