import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '@web/providers/redux/store';
import { useBackend } from './useBackend';
import { useEffect } from 'react';
import { AsyncThunkAction } from '@reduxjs/toolkit';

export type useResouceParams<
  T extends { data: any; loading: boolean; error: any },
> = {
  selector: (state: RootState) => T;
  fetcher: (
    backend: ReturnType<typeof useBackend>,
  ) => AsyncThunkAction<any, any, any>;
  deps?: Array<any>;
};

export const useReduxResource = <
  T extends { data: any; loading: boolean; error: any },
>({
  selector,
  fetcher,
  deps = [],
}: useResouceParams<T>) => {
  const backend = useBackend();
  const dispatch = useAppDispatch();
  const select = useAppSelector(selector);

  useEffect(() => {
    if (backend.status === 'authenticated' && !select.loading) {
      dispatch(fetcher(backend));
    }
  }, [backend.status, ...deps]);

  return { select, backend, dispatch };
};
