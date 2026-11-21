export type Theme = 'light' | 'dark';

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
}

export interface AppSettings {
  theme: Theme;
  language: string;
  notifications: boolean;
}

export interface AppStats {
  visits: number;
  lastVisit: string;
}

/** Сообщение из формы обратной связи */
export interface ContactMessage {
  name: string;
  email: string;
  message: string;
  timestamp: string;
}

/** Тип действия в логе активности */
export type ActionType = 'navigation' | 'settings_save' | 'contact_send';

/** Запись лога активности */
export interface ActionLogEntry {
  id: string;
  type: ActionType;
  description: string;
  timestamp: string;
}

export interface AppState {
  user: UserProfile;
  settings: AppSettings;
  stats: AppStats;
  contacts: ContactMessage[];
  activityLog: ActionLogEntry[];
}

/** Дефолтное состояние */
export const DEFAULT_STATE: AppState = {
  user: {
    name: 'Гость',
    email: '',
    bio: '',
  },
  settings: {
    theme: 'light',
    language: 'ru',
    notifications: true,
  },
  stats: {
    visits: 0,
    lastVisit: '',
  },
  contacts: [],
  activityLog: [],
};