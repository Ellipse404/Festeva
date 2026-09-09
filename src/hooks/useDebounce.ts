import { useState, useEffect, useRef, useCallback } from 'react';
import { UseDebounceOptions } from '../types';

/**
 * Custom hook to debounce a fast-changing value (e.g. search query inputs).
 *
 * @param value The value to debounce
 * @param delay Delay in milliseconds (default: 300ms)
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

/**
 * Custom hook to debounce a callback function with cancel and flush controls.
 *
 * @param callback Function to debounce
 * @param delay Delay in milliseconds (default: 300ms)
 * @param options Options for leading/trailing execution
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = 300,
  options: UseDebounceOptions = {},
): ((...args: Parameters<T>) => void) & { cancel: () => void; flush: () => void } {
  const { leading = false, trailing = true } = options;

  const callbackRef = useRef<T>(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgsRef = useRef<Parameters<T> | null>(null);
  const isLeadingCalledRef = useRef<boolean>(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    lastArgsRef.current = null;
    isLeadingCalledRef.current = false;
  }, []);

  const flush = useCallback(() => {
    if (timerRef.current && lastArgsRef.current) {
      callbackRef.current(...lastArgsRef.current);
      cancel();
    }
  }, [cancel]);

  const debounced = useCallback(
    (...args: Parameters<T>) => {
      lastArgsRef.current = args;

      if (!timerRef.current && leading && !isLeadingCalledRef.current) {
        callbackRef.current(...args);
        isLeadingCalledRef.current = true;
      }

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        if (trailing && lastArgsRef.current) {
          callbackRef.current(...lastArgsRef.current);
        }
        cancel();
      }, delay);
    },
    [delay, leading, trailing, cancel],
  );

  return Object.assign(debounced, { cancel, flush });
}
