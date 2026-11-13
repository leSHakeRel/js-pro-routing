import type { ReactNode } from 'react';

/** Карточка с опциональным заголовком */
export function Card({ title, children }: { title?: string; children?: ReactNode }): ReactNode {
  return (
    <div className="card">
      {title && <h2>{title}</h2>}
      {children}
    </div>
  );
}

/** Строка «метка — значение» для сводок */
export function Row({ label, value }: { label: string; value: string }): ReactNode {
  return (
    <div className="row">
      <span className="row-label">{label}</span>
      <span className="row-value">{value}</span>
    </div>
  );
}

/** Компактный бейдж */
export function Badge({ text }: { text: string }): ReactNode {
  return <span className="badge">{text}</span>;
}

/** Статистическая плитка для дашборда */
export function Stat({ value, label }: { value: string; label: string }): ReactNode {
  return (
    <div className="stat">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}