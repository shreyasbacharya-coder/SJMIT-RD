'use client';
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    
    const checkDevice = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    
    // Set initial state
    setIsMobile(mql.matches);
    
    // Add listener for changes
    mql.addEventListener('change', checkDevice);
    
    // Cleanup listener on unmount
    return () => {
      mql.removeEventListener('change', checkDevice);
    };
  }, []);

  return isMobile;
}
