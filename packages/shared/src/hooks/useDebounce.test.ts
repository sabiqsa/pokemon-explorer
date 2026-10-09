import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('useDebounce', () => {
  it('returns the initial value right away', () => {
    const { result } = renderHook(() => useDebounce('pika', 300));
    expect(result.current).toBe('pika');
  });

  it('updates only after the delay has passed', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'pika' },
    });

    rerender({ value: 'pikachu' });
    act(() => vi.advanceTimersByTime(299));
    expect(result.current).toBe('pika');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('pikachu');
  });

  it('restarts the timer when the value changes before the delay ends', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 300), {
      initialProps: { value: 'c' },
    });

    rerender({ value: 'ch' });
    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'cha' });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe('c');

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('cha');
  });
});
