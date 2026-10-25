import type { AppState } from '../types';

export type Listener = (state: AppState) => void;

export interface Store {
  getState(): AppState;
  setState(partial: Partial<AppState>): void;
  subscribe(listener: Listener): () => void;
}

export function createStore(initialState: AppState): Store {
  let state: AppState = { ...initialState };
  const listeners = new Set<Listener>();

  return {
    getState: () => state,
    setState: (partial) => {
      state = { ...state, ...partial };
      for (const listener of listeners) {
        listener(state);
      }
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}