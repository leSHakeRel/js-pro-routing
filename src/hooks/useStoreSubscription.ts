import { useState, useEffect } from 'react';
import type { AppState } from '../types';
import type { Store } from '../store/store';

/**
 * Хук для подписки на store и получения актуального состояния.
 * При изменении store компонент перерендеривается.
 *
 * @param store - глобальный store
 */
export function useStore(store: Store): AppState {
  const [state, setState] = useState<AppState>(() => store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe((newState) => {
      setState({ ...newState });
    });
    return unsubscribe;
  }, [store]);

  return state;
}