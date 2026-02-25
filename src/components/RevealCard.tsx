import { useEffect, useRef, useState, ReactNode } from 'react';

interface RevealCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

/**
 * RevealCard - A wrapper component that animates children into view when scrolled into viewport
 * Uses Intersection Observer API for performant scroll detection
 * 
 * Features:
 * - Starts hidden (opacity 0, translateY 50px)
 * - Fades in and slides up when entering viewport
 * - Animates only once (not repeat on scroll up)
 * - Smooth 0.6s transition
 */
export function RevealCard({ children, className = '', delay = 0 }: RevealCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Create the intersection observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger once when element enters viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing after revealed (animate only once)
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px', // Offset to trigger slightly before fully visible
      }
    );

    observer.observe(element);

    // Cleanup observer on unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}

export default RevealCard;
