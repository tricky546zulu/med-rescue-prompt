
import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * A hook to keep the screen awake using the Screen Wake Lock API.
 * The lock is requested when the component mounts and released when it unmounts.
 * It also handles visibility changes to re-acquire the lock.
 * @returns {object} An object containing the lock status.
 * @property {boolean} isLocked - True if the screen wake lock is active.
 * @property {boolean} isSupported - True if the Screen Wake Lock API is supported by the browser.
 */
export const useWakeLock = () => {
  const [isLocked, setIsLocked] = useState(false);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const isSupported = 'wakeLock' in navigator;

  const requestWakeLock = useCallback(async () => {
    if (isSupported && document.visibilityState === 'visible') {
      try {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
        setIsLocked(true);
        wakeLockRef.current.addEventListener('release', () => {
          // This is called when the lock is released by the system.
          setIsLocked(false);
          wakeLockRef.current = null;
        });
      } catch (err) {
        console.error(`Wake Lock request failed: ${(err as Error).name}, ${(err as Error).message}`);
        setIsLocked(false);
      }
    }
  }, [isSupported]);

  useEffect(() => {
    requestWakeLock();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        requestWakeLock();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
    };
  }, [requestWakeLock]);
  
  return { isLocked, isSupported };
};
