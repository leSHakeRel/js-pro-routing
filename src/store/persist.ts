import type { AppSettings } from '../types';
import type { Store } from './store';

const STORAGE_KEY = 'mini-spa:settings';

export function loadSettings(): Partial<AppSettings> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch {
    return {};
  }
}

export function persistSettings(store: Store): void {
  store.subscribe((state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.settings));
    } catch {
        console.log('Упс, localStorage может быть недоступен... Игнорим');
    }
  });
}