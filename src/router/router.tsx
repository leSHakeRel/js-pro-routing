import { createRoot, type Root } from 'react-dom/client';
import type { ReactNode } from 'react';
import type { Store } from '../store/store';

const BASE_URL = import.meta.env.BASE_URL;

export interface Page {
  path: string;
  title: string;
  component: (props: { store: Store }) => ReactNode;
}

export interface RouterOptions {
  onNavigate?: (path: string) => void;
}

/** History API роутер с рендерингом React-компонентов */
export class Router {
  private pages: Page[] = [];
  private root: Root | null = null;

  constructor(
    private readonly appRoot: HTMLElement,
    private readonly store: Store,
    private readonly options: RouterOptions = {},
  ) {
    window.addEventListener('popstate', () => this.handleRoute());
    document.addEventListener('click', (event) => this.handleLinkClick(event));
  }

  addPage(page: Page): this {
    this.pages.push(page);
    return this;
  }

  start(): void {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      window.history.replaceState({}, '', this.toUrl(hash.slice(1)));
    }
    this.handleRoute();
  }

  navigate(path: string): void {
    const url = this.toUrl(path);
    if (url === window.location.pathname) {
      return;
    }
    window.history.pushState({}, '', url);
    this.handleRoute();
  }

  private handleLinkClick(event: MouseEvent): void {
    if (event.button !== 0 || event.defaultPrevented) {
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    const anchor = target.closest('a[data-link]');
    if (!anchor) {
      return;
    }
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('#')) {
      return;
    }
    event.preventDefault();
    this.navigate(href);
  }

  private handleRoute(): void {
    const path = this.getCurrentPath();
    const page = this.pages.find((p) => p.path === path) ?? this.notFoundPage();
    document.title = page.title;

    this.options.onNavigate?.(path);

    if (!this.root) {
      this.root = createRoot(this.appRoot);
    }

    const Component = page.component;
    this.root.render(<Component store={this.store} />);
  }

  private getCurrentPath(): string {
    const hash = window.location.hash;
    if (hash.startsWith('#/')) {
      return hash.slice(1);
    }
    const base = BASE_URL.replace(/\/$/, '');
    let path = window.location.pathname;
    if (base && path.startsWith(base)) {
      path = path.slice(base.length) || '/';
    }
    return path || '/';
  }

  private toUrl(path: string): string {
    const base = BASE_URL.replace(/\/$/, '');
    return base ? `${base}${path}` : path;
  }

  private notFoundPage(): Page {
    return {
      path: '*',
      title: '404 — Страница не найдена',
      component: () => {
        const currentPath = this.getCurrentPath();
        return (
          <section className="page not-found">
            <div className="big">404</div>
            <h1>Страница не найдена</h1>
            <p className="subtitle">Путь «{currentPath}» не существует.</p>
            <a href="/" data-link className="btn btn-primary">На главную</a>
          </section>
        );
      },
    };
  }
}