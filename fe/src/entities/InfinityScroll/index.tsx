'use client';

import React, { forwardRef, useEffect, useRef } from 'react';
import { Loader } from '../../shared/ui/Loader';
import clsx from 'clsx';

export type InfinityScrollProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  inverted?: boolean;
  onFetchNext?: () => void;
  isLoading?: boolean;
  As?: React.ComponentType<React.ComponentPropsWithRef<any>>;
  loaderClass?: string;
};

export const InfinityScroll = forwardRef<HTMLDivElement, InfinityScrollProps>(
  (
    {
      children,
      inverted,
      onFetchNext,
      loaderClass,
      As,
      ...rest
    },
    ref,
  ) => {
    const bottomRef = useRef<HTMLDivElement>(null);
    const cbRef = useRef<InfinityScrollProps['onFetchNext']>();

    useEffect(() => {
      cbRef.current = onFetchNext;
    }, [onFetchNext]);

    const observerRef = useRef<IntersectionObserver>();

    const loaderJsx = (
      <div ref={bottomRef} className={clsx('text-center', loaderClass)}>
        {isLoading && <Loader className='w-full' />}
      </div>
    );

    useEffect(() => {
      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          if (entry.target.hasChildNodes()) {
            cbRef.current?.();
          }
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.1,
        },
      );

      if (bottomRef.current) {
        observerRef.current.observe(bottomRef.current);
        return () => {
          bottomRef.current &&
            observerRef.current?.unobserve(bottomRef.current!);
        };
      }
    }, [bottomRef.current]);

    return (
      <As {...rest} ref={ref}>
        {inverted && loaderJsx}
        {children}
        {!inverted && loaderJsx}
      </As>
    );
  },
);
