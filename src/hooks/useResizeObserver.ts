import debounce from "lodash/debounce";
import throttle from "lodash/throttle";
import { useEffect, useState } from "react";

/**
 * Hook to observe the size of an element and connect that to React state.
 */
export function useResizeObserver<T extends HTMLDivElement>(
  optimizationStrategy: "throttle" | "debounce" = "throttle",
  timeout = 100
): [DOMRect | undefined, (el: T) => void] {
  const [size, setSize] = useState<DOMRect>();
  const [element, setElement] = useState<T | null>(null);

  useEffect(() => {
    if (element) {
      const limitFn = optimizationStrategy === "throttle" ? throttle : debounce;

      const resizeObserver = new ResizeObserver(
        limitFn<ResizeObserverCallback>((entries) => {
          const entry = entries[0]!!;
          setSize(entry.target.getBoundingClientRect());
        }, timeout)
      );

      resizeObserver.observe(element, {});

      return () => resizeObserver.unobserve(element);
    }
  }, [optimizationStrategy, timeout, element]);

  return [size, setElement];
}
