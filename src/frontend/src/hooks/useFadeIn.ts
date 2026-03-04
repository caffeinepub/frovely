import { useEffect, useRef } from "react";

export function useFadeIn<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.05,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Find all child elements with fade-in-section class
    const targets = el.querySelectorAll<HTMLElement>(".fade-in-section");

    if (targets.length === 0) {
      // If no children, observe the element itself
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add("visible");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold },
      );
      el.classList.add("fade-in-section");
      observer.observe(el);
      return () => observer.disconnect();
    }

    const observers: IntersectionObserver[] = [];
    for (const target of targets) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).classList.add("visible");
              observer.unobserve(entry.target);
            }
          }
        },
        { threshold },
      );
      observer.observe(target);
      observers.push(observer);
    }

    return () => {
      for (const obs of observers) obs.disconnect();
    };
  }, [threshold]);

  return ref;
}
