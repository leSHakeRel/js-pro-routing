import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createStore } from '../../store/store';
import { DEFAULT_STATE } from '../../types';
import { ContactsPage } from '../Contacts';

describe('Contacts page', () => {
  const store = createStore({ ...DEFAULT_STATE });

  beforeEach(() => {
    store.setState({ ...DEFAULT_STATE });
  });

  it('должен рендерить заголовок страницы', () => {
    render(<ContactsPage store={store} />);
    expect(screen.getByText('Контакты')).toBeTruthy();
  });

  it('должен рендерить форму обратной связи', () => {
    render(<ContactsPage store={store} />);
    const form = document.querySelector('form#contacts-form');
    expect(form).not.toBeNull();
  });

  it('должен содержать поле имени', () => {
    render(<ContactsPage store={store} />);
    const nameInput = document.querySelector<HTMLInputElement>('[name="name"]');
    expect(nameInput).not.toBeNull();
    expect(nameInput?.required).toBe(true);
  });

  it('должен содержать поле email', () => {
    render(<ContactsPage store={store} />);
    const emailInput = document.querySelector<HTMLInputElement>('[name="email"]');
    expect(emailInput).not.toBeNull();
    expect(emailInput?.type).toBe('email');
  });

  it('должен содержать поле сообщения', () => {
    render(<ContactsPage store={store} />);
    const messageTextarea = document.querySelector<HTMLTextAreaElement>('[name="message"]');
    expect(messageTextarea).not.toBeNull();
    expect(messageTextarea?.required).toBe(true);
  });

  it('должен содержать кнопку отправки', () => {
    render(<ContactsPage store={store} />);
    const submitBtn = document.querySelector<HTMLButtonElement>('button[type="submit"]');
    expect(submitBtn).not.toBeNull();
    expect(submitBtn?.textContent).toBe('Отправить');
  });
});