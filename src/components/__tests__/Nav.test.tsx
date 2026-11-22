import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { createStore } from '../../store/store';
import { DEFAULT_STATE } from '../../types';
import { Nav } from '../Nav';

function renderNav(store = createStore({ ...DEFAULT_STATE })) {
  return render(
    <MemoryRouter>
      <Nav store={store} />
    </MemoryRouter>,
  );
}

describe('Nav component', () => {
  const store = createStore({ ...DEFAULT_STATE });

  beforeEach(() => {
    store.setState({ ...DEFAULT_STATE });
  });

  it('должен рендерить все навигационные ссылки', () => {
    renderNav(store);
    expect(screen.getByText('Главная')).toBeTruthy();
    expect(screen.getByText('Настройки')).toBeTruthy();
    expect(screen.getByText('О приложении')).toBeTruthy();
    expect(screen.getByText('Дашборд')).toBeTruthy();
    expect(screen.getByText('Контакты')).toBeTruthy();
    expect(screen.getByText('Лог')).toBeTruthy();
  });

  it('должен содержать 6 ссылок', () => {
    renderNav(store);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(6);
  });

  it('ссылки должны иметь правильные href', () => {
    renderNav(store);

    const expectedPaths = ['/', '/settings', '/about', '/dashboard', '/contacts', '/activity-log'];
    expectedPaths.forEach((path) => {
      const link = screen.getByText(
        path === '/' ? 'Главная' :
        path === '/settings' ? 'Настройки' :
        path === '/about' ? 'О приложении' :
        path === '/dashboard' ? 'Дашборд' :
        path === '/contacts' ? 'Контакты' :
        'Лог',
      );
      expect(link.getAttribute('href')).toBe(path);
    });
  });

  it('должен подсвечивать активную ссылку (currentSection совпадает с path)', () => {
    store.setState({ currentSection: '/about' });
    renderNav(store);

    const aboutLink = screen.getByText('О приложении');
    expect(aboutLink.className).toContain('active');

    const homeLink = screen.getByText('Главная');
    expect(homeLink.className).not.toContain('active');
  });

  it('не должен подсвечивать ссылки если currentSection не совпадает', () => {
    store.setState({ currentSection: '/unknown' });
    renderNav(store);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link.className).not.toContain('active');
    });
  });

  it('не должен подсвечивать ссылки если currentSection равен null', () => {
    renderNav(store);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      expect(link.className).not.toContain('active');
    });
  });

  it('должен подсвечивать только одну ссылку', () => {
    store.setState({ currentSection: '/dashboard' });
    renderNav(store);

    const activeLinks = screen.getAllByRole('link').filter(
      (link) => link.className === 'active',
    );
    expect(activeLinks).toHaveLength(1);
    expect(activeLinks[0].textContent).toBe('Дашборд');
  });
});