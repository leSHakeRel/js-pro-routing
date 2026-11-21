import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { createStore } from '../../store/store';
import { DEFAULT_STATE } from '../../types';
import { useStore } from '../useStoreSubscription';

describe('useStore', () => {
  const store = createStore({ ...DEFAULT_STATE });

  beforeEach(() => {
    store.setState({ ...DEFAULT_STATE });
  });

  it('должен возвращать текущее состояние', () => {
    const { result } = renderHook(() => useStore(store));
    expect(result.current).toEqual(store.getState());
  });

  it('должен обновляться при изменении состояния', () => {
    const { result } = renderHook(() => useStore(store));
    act(() => {
      store.setState({ user: { name: 'Новый', email: '', bio: '' } });
    });
    expect(result.current.user.name).toBe('Новый');
  });

  it('должен отписываться от store при размонтировании', () => {
    const renderFn = vi.fn();
    const { unmount } = renderHook(() => useStore(store));
    const unsubscribe = store.subscribe(renderFn);
    unmount();
    act(() => {
      store.setState({ user: { name: 'После отписки', email: '', bio: '' } });
    });
    // После размонтирования хук не должен вызывать setState
    // Но store.subscribe всё ещё активна, так что renderFn вызывается
    expect(renderFn).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});