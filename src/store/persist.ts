import type { AppSettings, AppStats, ActionLogEntry, UserProfile } from '../types';
import type { Store } from './store';

const STORAGE_KEY = 'mini-spa:settings';
const LOG_KEY = 'mini-spa:activity-log';
const SECTION_KEY = 'mini-spa:current-section';

/** Внутренний формат данных, сохранённых в localStorage */
interface StoredData {
  settings?: Partial<AppSettings>;
  user?: Partial<UserProfile>;
  stats?: Partial<AppStats>;
}

/**
 * Загружает настройки, данные пользователя и статистику из localStorage.
 * Поддерживает обратную совместимость со старым форматом (только AppSettings).
 */
export function loadStore(): { settings: Partial<AppSettings>; user: Partial<UserProfile>; stats: Partial<AppStats> } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { settings: {}, user: {}, stats: {} };
    }
    const parsed = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null) {
      return { settings: {}, user: {}, stats: {} };
    }

    // Новый формат: { settings: {...}, user: {...}, stats: {...} }
    if ('settings' in parsed || 'user' in parsed || 'stats' in parsed) {
      return {
        settings: (parsed as StoredData).settings ?? {},
        user: (parsed as StoredData).user ?? {},
        stats: (parsed as StoredData).stats ?? {},
      };
    }

    // Старый формат: просто объект AppSettings
    return {
      settings: parsed as Partial<AppSettings>,
      user: {},
      stats: {},
    };
  } catch {
    return { settings: {}, user: {}, stats: {} };
  }
}

/**
 * Сохраняет настройки, данные пользователя и статистику в localStorage.
 * Подписывается на изменения store и пишет объект { settings, user, stats }.
 */
export function persistStore(store: Store): void {
  store.subscribe((state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        settings: state.settings,
        user: state.user,
        stats: state.stats,
      }));
    } catch {
      console.log('Упс, localStorage может быть недоступен... Игнорим');
    }
  });
}

// ---- backward-compatible обёртки для settings ----

export function loadSettings(): Partial<AppSettings> {
  return loadStore().settings;
}

export function persistSettings(store: Store): void {
  persistStore(store);
}

// ---- удобные функции для user ----

export function loadUser(): Partial<UserProfile> {
  return loadStore().user;
}

export function persistUser(store: Store): void {
  persistStore(store);
}

export function loadActivityLog(): ActionLogEntry[] {
  try {
    const raw = localStorage.getItem(LOG_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as ActionLogEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function persistActivityLog(store: Store): void {
  store.subscribe((state) => {
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(state.activityLog));
    } catch {
      console.log('Упс, localStorage может быть недоступен... Игнорим');
    }
  });
}

// ---- функции для currentSection ----

export function loadCurrentSection(): string | null {
  try {
    const saved = localStorage.getItem(SECTION_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}

export function persistCurrentSection(store: Store): void {
  store.subscribe((state) => {
    if (state.currentSection) {
      try {
        localStorage.setItem(SECTION_KEY, JSON.stringify(state.currentSection));
      } catch {
        // ignore
      }
    }
  });
}