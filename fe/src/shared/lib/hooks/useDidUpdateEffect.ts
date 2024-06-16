import { useEffect, useRef } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';

export function useDidUpdateEffect(
  fn: () => void | (() => void),
  inputs: Array<unknown>,
) {
  const isMountingRef = useRef(false);

  useEffect(() => {
    if (isMountingRef.current) {
      return fn();
    }
    isMountingRef.current = true;
  }, inputs);
}

export function useDidUpdateEffectDeep(
  fn: () => void | (() => void),
  inputs: Array<unknown>,
) {
  const isMountingRef = useRef(false);

  useDeepCompareEffect(() => {
    if (isMountingRef.current) {
      return fn();
    }
    isMountingRef.current = true;
  }, inputs);
}
