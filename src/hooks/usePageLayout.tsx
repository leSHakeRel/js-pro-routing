import type { ReactNode } from 'react';

/**
 * Компонент типового макета страницы.
 *
 * @param title - заголовок страницы (h1)
 * @param subtitle - подзаголовок (p.subtitle)
 * @param cardTitle - опциональный заголовок карточки (h2 внутри card)
 * @param children - содержимое внутри карточки
 */
export function PageLayout({
  title,
  subtitle,
  cardTitle,
  children,
}: {
  title: string;
  subtitle: string;
  cardTitle?: string;
  children?: ReactNode;
}): ReactNode {
  return (
    <section className="page">
      <h1>{title}</h1>
      <p className="subtitle">{subtitle}</p>
      <div className="card">
        {cardTitle && <h2>{cardTitle}</h2>}
        {children}
      </div>
    </section>
  );
}