import { useRef } from "react";

let count = 0;

export function useId(prefix = "element"): string {
  const id = useRef("");

  if (!id.current) {
    id.current = `${prefix}-${count++}`;
  }

  return id.current;
}
