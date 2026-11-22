import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('должен вводить текст в поля формы через userEvent', async () => {
    const user = userEvent.setup();
    render(<ContactsPage store={store} />);

    const nameInput = screen.getByPlaceholderText('Ваше имя');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const messageTextarea = screen.getByPlaceholderText('Ваше сообщение...');

    await user.type(nameInput, 'Иван');
    await user.type(emailInput, 'ivan@test.com');
    await user.type(messageTextarea, 'Привет! Это тестовое сообщение.');

    expect(nameInput).toHaveValue('Иван');
    expect(emailInput).toHaveValue('ivan@test.com');
    expect(messageTextarea).toHaveValue('Привет! Это тестовое сообщение.');
  });

  it('должен показывать ошибку валидации при неверном email', async () => {
    const user = userEvent.setup();
    render(<ContactsPage store={store} />);

    const nameInput = screen.getByPlaceholderText('Ваше имя');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const messageTextarea = screen.getByPlaceholderText('Ваше сообщение...');
    const submitBtn = screen.getByText('Отправить');

    await user.type(nameInput, 'Иван');
    await user.type(emailInput, 'неверный-email');
    await user.type(messageTextarea, 'Тестовое сообщение длиной более 10 символов');
    await user.click(submitBtn);

    expect(screen.getByText('Укажите корректный email')).toBeTruthy();
    expect(screen.getByText('✗ Исправьте ошибки в форме')).toBeTruthy();
  });

  it('должен показывать ошибку валидации при пустом имени', async () => {
    const user = userEvent.setup();
    render(<ContactsPage store={store} />);

    const emailInput = screen.getByPlaceholderText('you@example.com');
    const messageTextarea = screen.getByPlaceholderText('Ваше сообщение...');
    const submitBtn = screen.getByText('Отправить');

    await user.type(emailInput, 'ivan@test.com');
    await user.type(messageTextarea, 'Тестовое сообщение длиной более 10 символов');
    await user.click(submitBtn);

    expect(screen.getByText('Имя должно содержать минимум 2 символа')).toBeTruthy();
  });

  it('должен успешно отправлять форму и добавлять контакт в store', async () => {
    const user = userEvent.setup();
    render(<ContactsPage store={store} />);

    const nameInput = screen.getByPlaceholderText('Ваше имя');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const messageTextarea = screen.getByPlaceholderText('Ваше сообщение...');
    const submitBtn = screen.getByText('Отправить');

    await user.type(nameInput, 'Иван');
    await user.type(emailInput, 'ivan@test.com');
    await user.type(messageTextarea, 'Тестовое сообщение длиной более 10 символов');
    await user.click(submitBtn);

    const state = store.getState();
    expect(state.contacts).toHaveLength(1);
    expect(state.contacts[0].name).toBe('Иван');
    expect(state.contacts[0].email).toBe('ivan@test.com');
    expect(state.contacts[0].message).toBe('Тестовое сообщение длиной более 10 символов');

    expect(screen.getByText('✓ Сообщение отправлено!')).toBeTruthy();
  });

  it('должен очищать форму после успешной отправки', async () => {
    const user = userEvent.setup();
    render(<ContactsPage store={store} />);

    const nameInput = screen.getByPlaceholderText('Ваше имя');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const messageTextarea = screen.getByPlaceholderText('Ваше сообщение...');
    const submitBtn = screen.getByText('Отправить');

    await user.type(nameInput, 'Иван');
    await user.type(emailInput, 'ivan@test.com');
    await user.type(messageTextarea, 'Тестовое сообщение длиной более 10 символов');
    await user.click(submitBtn);

    expect(nameInput).toHaveValue('');
    expect(emailInput).toHaveValue('');
    expect(messageTextarea).toHaveValue('');
  });

  it('должен показывать несколько ошибок валидации при пустой форме', async () => {
    const user = userEvent.setup();
    render(<ContactsPage store={store} />);

    const submitBtn = screen.getByText('Отправить');
    await user.click(submitBtn);

    expect(screen.getByText('Имя должно содержать минимум 2 символа')).toBeTruthy();
    expect(screen.getByText('Укажите корректный email')).toBeTruthy();
    expect(screen.getByText('Сообщение должно содержать минимум 10 символов')).toBeTruthy();
  });
});