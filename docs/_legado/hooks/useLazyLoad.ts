import { useEffect, useRef, useState } from 'react';

type UseLazyLoadOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  enabled?: boolean;
};

export function useLazyLoad<T extends HTMLElement = HTMLDivElement>({
  root = null,
  rootMargin = '0px',
  threshold = 0.1,
  enabled = true,
}: UseLazyLoadOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Desconecta o observer após o primeiro carregamento
          observer.disconnect();
        }
      },
      {
        root,
        rootMargin,
        threshold,
      }
    );

    const currentElement = elementRef.current;

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
      observer.disconnect();
    };
  }, [enabled, root, rootMargin, threshold]);

  return [elementRef, isVisible] as const;
}
