'use client';

import { useEffect } from 'react';

export function JsonLd({ data }: { data: string }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.dataset.portfolioJsonLd = 'true';
    script.text = data;
    document.head.appendChild(script);
    return () => script.remove();
  }, [data]);

  return null;
}
