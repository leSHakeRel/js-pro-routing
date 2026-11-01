import type { Store } from '../store/store';

const BASE_URL = import.meta.env.BASE_URL;

export interface RenderedPage {
  element: HTMLElement;
  cleanup?: () => void;
}

export interface Page {
  path: string;
  title: string;
  render: (store: Store) => RenderedPage;
}

export interface RouterOptions {
  onNavigate?: (path: string) => void;
}

/** History API роутер */
export class Router {
  private pages: Page[] = [];
  private currentCleanup: (() => void) | undefined;

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
    this.currentCleanup?.();
    this.currentCleanup = undefined;

    const path = this.getCurrentPath();
    const page = this.pages.find((p) => p.path === path) ?? this.notFoundPage();
    document.title = page.title;

    this.options.onNavigate?.(path);

    const { element, cleanup } = page.render(this.store);
    this.currentCleanup = cleanup;
    this.appRoot.replaceChildren(element);
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
      render: () => {
        const section = document.createElement('section');
        section.className = 'page not-found';

        const big = document.createElement('div');
        big.className = 'big';
        big.textContent = '404';

        const h1 = document.createElement('h1');
        h1.textContent = 'Страница не найдена';

        const p = document.createElement('p');
        p.className = 'subtitle';
        p.textContent = `Путь «${this.getCurrentPath()}» не существует.`;

        const link = document.createElement('a');
        link.href = '/';
        link.dataset.link = '';
        link.className = 'btn btn-primary';
        link.textContent = 'На главную';

        section.append(big, h1, p, link);
        return { element: section };
      },
    };
  }
}