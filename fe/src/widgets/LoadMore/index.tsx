'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { InfinityScroll } from '@entities/InfinityScroll';
import { usePathname } from 'next/navigation';
import { getPageUrl } from './lib/utils';
import { loadFunctions } from './lib/modes';
import { DefaultParams } from './lib/types';

export type LoadMoreProps<P extends DefaultParams = DefaultParams> = {
  mode: keyof typeof loadFunctions;
  initialParams: P;
  query?: string;
};

export const LoadMore = <T, P extends DefaultParams = DefaultParams>({
  initialParams,
  mode,
}: LoadMoreProps<P>) => {
  const paramsRef = useRef(initialParams);
  const [list, setList] = useState<T[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setList([]);
    paramsRef.current = initialParams;
  }, [initialParams]);

  const onFetchNext = useCallback(() => {
    setLoading(true);
    //@ts-ignore
    loadFunctions[mode]
      .load(paramsRef.current)
      .then((fetched) => {
        if (fetched?.results) {
          setList((prev) => [...prev, ...(fetched.results as T[])]);
          paramsRef.current.page += 1;
        }

        setHasMore(Boolean(fetched.info.pagesTotal > paramsRef.current.page));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [mode, list]);

  return (
    <InfinityScroll
      As={Fragment}
      onFetchNext={hasMore ? onFetchNext : undefined}
      isLoading={isLoading}
      loaderClass='col-span-2 md:col-span-3 lg:col-span-4'
    >
      {list.map(loadFunctions[mode].render)}
    </InfinityScroll>
  );
};
