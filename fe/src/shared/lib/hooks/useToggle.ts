import { useReducer } from 'react';

export const useToggle = (initial?: boolean) => {
  return useReducer((state) => {
    return !state;
  }, Boolean(initial));
};
