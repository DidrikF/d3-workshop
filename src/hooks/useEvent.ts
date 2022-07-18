import React, { useCallback, useEffect } from "react";

/**
 * React useEvent polyfill
 */
export function useEvent<Args extends unknown[]>(
  callback: (...args: Args) => void
): (...args: Args) => void {
  const callbackRef = React.useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const stableCallback = useCallback((...args: Args) => {
    callbackRef.current(...args);
  }, []);

  return stableCallback;
}
