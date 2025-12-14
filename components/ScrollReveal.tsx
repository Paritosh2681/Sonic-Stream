import React, { useRef, useEffect, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  delay?: number; // Delay in ms
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  className = "", 
  threshold = 0.1,
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Add delay if specified, otherwise show immediately
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          observer.unobserve(element);
        }
      },
      {
        threshold,
        // Removed negative rootMargin which could hide elements that are partially cut off
        // '0px' is standard and reliable
        rootMargin: '0px' 
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [threshold, delay]);

  return (
    <div 
      ref={ref} 
      className={`reveal-on-scroll ${isVisible ? 'is-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
};