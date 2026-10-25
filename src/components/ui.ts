/** Карточка с опциональным заголовком. */
export function createCard(title?: string): HTMLElement {
  const card = document.createElement('div');
  card.className = 'card';
  if (title) {
    const h = document.createElement('h2');
    h.textContent = title;
    card.appendChild(h);
  }
  return card;
}

/** Строка «метка — значение» для сводок. */
export function createRow(label: string, value: string): HTMLElement {
  const row = document.createElement('div');
  row.className = 'row';

  const labelEl = document.createElement('span');
  labelEl.className = 'row-label';
  labelEl.textContent = label;

  const valueEl = document.createElement('span');
  valueEl.className = 'row-value';
  valueEl.textContent = value;

  row.append(labelEl, valueEl);
  return row;
}

/** Компактный бейдж. */
export function createBadge(text: string): HTMLElement {
  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = text;
  return badge;
}

/** Статистическая плитка для дашборда. */
export function createStat(value: string, label: string): HTMLElement {
  const stat = document.createElement('div');
  stat.className = 'stat';

  const valueEl = document.createElement('div');
  valueEl.className = 'stat-value';
  valueEl.textContent = value;

  const labelEl = document.createElement('div');
  labelEl.className = 'stat-label';
  labelEl.textContent = label;

  stat.append(valueEl, labelEl);
  return stat;
}