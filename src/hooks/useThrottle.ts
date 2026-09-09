import { useState, useEffect, useRef, useCallback } from 'react';
import { UseThrottleOptions } from '../types';

/**
 * Custom hook to throttle a fast-updating value (e.g., window scroll position or viewport size).
 *
 * @param value The value to throttle
 * @param interval Throttle interval in milliseconds (default: 300ms)
 * @returns The throttled value
 */
export function useThrottle<T>(value: T, interval: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecutedRef = useRef<number>(Date.now());

  useEffect(() => {
    const now = Date.now();
    const elapsed = now - lastExecutedRef.current;

    if (elapsed >= interval) {
      lastExecutedRef.current = now;
      setThrottledValue(value);
      return undefined;
    }

    const timer = setTimeout(() => {
      lastExecutedRef.current = Date.now();
      setThrottledValue(value);
    }, interval - elapsed);

    return () => {
      clearTimeout(timer);
    };
  }, [value, interval]);

  return throttledValue;
}

/**
 * Custom hook to throttle a callback function (e.g., scroll handlers, resize handlers).
 *
 * @param callback Function to throttle
 * @param interval Throttle interval in milliseconds (default: 300ms)
 * @param options Options for leading/trailing execution
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  interval: number = 300,
  options: UseThrottleOptions = {},
): ((...args: Parameters<T>) => void) & { cancel: () => void } {
  const { leading = true, trailing = true } = options;

  const callbackRef = useRef<T>(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastExecutedRef = useRef<number>(0);
  const lastArgsRef = useRef<Parameters<T> | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const cancel = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    lastArgsRef.current = null;
  }, []);

  const throttled = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      const elapsed = now - lastExecutedRef.current;
      lastArgsRef.current = args;

      const execute = () => {
        lastExecutedRef.current = Date.now();
        if (lastArgsRef.current) {
          callbackRef.current(...lastArgsRef.current);
          lastArgsRef.current = null;
        }
      };

      if (elapsed >= interval) {
        if (leading) {
          execute();
        } else if (trailing && !timerRef.current) {
          timerRef.current = setTimeout(() => {
            execute();
            timerRef.current = null;
          }, interval);
        }
      } else if (trailing && !timerRef.current) {
        timerRef.current = setTimeout(() => {
          execute();
          timerRef.current = null;
        }, interval - elapsed);
      }
    },
    [interval, leading, trailing],
  );

  return Object.assign(throttled, { cancel });
}
