import { useEffect } from 'react';

export const useClickOutside = (
  ref: React.RefObject<HTMLElement | undefined | null>,
  callback: () => void,
) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as HTMLElement)) {
      callback();
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);
};
