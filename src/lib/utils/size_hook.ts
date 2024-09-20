import { useState, useEffect, useRef } from 'react';

export const useComponentSize = () => {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      if (entries.length === 0) return;
      const entry = entries[0];
      if (!entry) return;
      setWidth(entry.contentRect.width);
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(ref.current);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
};
