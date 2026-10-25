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

export interface AppState {
  user: UserProfile;
  settings: AppSettings;
  stats: AppStats;
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
};