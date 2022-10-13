import { useRef } from "react";

let count = 0;

/**
 * Hook to generate a unique id for the lifetime of the consuming component.
 */
export function useId(prefix = "element"): string {
  const id = useRef("");

  if (!id.current) {
    id.current = `${prefix}-${count++}`;
  }

  return id.current;
}
