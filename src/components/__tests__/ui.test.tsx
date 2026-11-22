import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card, Row, Badge, Stat } from '../ui';

describe('Card component', () => {
  it('должен рендерить заголовок карточки', () => {
    render(<Card title="Тестовая карточка" />);
    expect(screen.getByText('Тестовая карточка')).toBeTruthy();
  });

  it('должен рендерить дочерние элементы', () => {
    render(
      <Card title="Карточка">
        <p>Контент карточки</p>
      </Card>,
    );
    expect(screen.getByText('Контент карточки')).toBeTruthy();
  });

  it('не должен рендерить заголовок если title не передан', () => {
    const { container } = render(
      <Card>
        <p>Контент без заголовка</p>
      </Card>,
    );
    expect(container.querySelector('h2')).toBeNull();
  });

  it('должен иметь класс card', () => {
    const { container } = render(<Card title="Card" />);
    expect(container.firstChild).toHaveClass('card');
  });
});

describe('Row component', () => {
  it('должен рендерить label и value', () => {
    render(<Row label="Имя" value="Анна" />);
    expect(screen.getByText('Имя')).toBeTruthy();
    expect(screen.getByText('Анна')).toBeTruthy();
  });

  it('должен иметь класс row', () => {
    const { container } = render(<Row label="L" value="V" />);
    expect(container.firstChild).toHaveClass('row');
  });

  it('должен иметь класс row-label у метки', () => {
    render(<Row label="Метка" value="Значение" />);
    const labelSpan = screen.getByText('Метка');
    expect(labelSpan).toHaveClass('row-label');
  });

  it('должен иметь класс row-value у значения', () => {
    render(<Row label="Метка" value="Значение" />);
    const valueSpan = screen.getByText('Значение');
    expect(valueSpan).toHaveClass('row-value');
  });
});

describe('Badge component', () => {
  it('должен рендерить текст бейджа', () => {
    render(<Badge text="Новый" />);
    expect(screen.getByText('Новый')).toBeTruthy();
  });

  it('должен иметь класс badge', () => {
    const { container } = render(<Badge text="Badge" />);
    expect(container.firstChild).toHaveClass('badge');
  });
});

describe('Stat component', () => {
  it('должен рендерить значение и метку', () => {
    render(<Stat value="42" label="Посещений" />);
    expect(screen.getByText('42')).toBeTruthy();
    expect(screen.getByText('Посещений')).toBeTruthy();
  });

  it('должен иметь класс stat', () => {
    const { container } = render(<Stat value="1" label="S" />);
    expect(container.firstChild).toHaveClass('stat');
  });

  it('должен иметь класс stat-value у значения', () => {
    render(<Stat value="100" label="Likes" />);
    const valueDiv = screen.getByText('100');
    expect(valueDiv).toHaveClass('stat-value');
  });

  it('должен иметь класс stat-label у метки', () => {
    render(<Stat value="5" label="Рейтинг" />);
    const labelDiv = screen.getByText('Рейтинг');
    expect(labelDiv).toHaveClass('stat-label');
  });
});