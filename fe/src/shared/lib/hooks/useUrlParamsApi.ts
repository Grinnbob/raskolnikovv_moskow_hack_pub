import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import debounce from 'lodash.debounce';
import {
  Values,
  getReplacedQueryUrl,
  getUpdatedQueryUrl,
} from '@web/shared/lib/getUpdatedQueryUrl';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const singletone: {
  applyFiltersBulk?: (query: Record<string, Values>) => void;
  applyFilter?: (name: string, values: Values) => void;
  clearAll?: () => void;
} = {
  applyFilter: undefined,
  clearAll: undefined,
  applyFiltersBulk: undefined,
};

const refetch = debounce(
  (url: string, router: AppRouterInstance) =>
    router.replace(url, { scroll: false }),
  0,
);

export const useUrlParamsApi = () => {
  const router = useRouter();

  useEffect(() => {
    singletone.applyFilter = (...args) => {
      // eslint-disable-next-line prefer-spread
      const nextUrl = getUpdatedQueryUrl.apply(null, args);
      window.history.replaceState({}, '', nextUrl);
      refetch(nextUrl, router);
    };

    singletone.applyFiltersBulk = (query) => {
      const nextUrl = getReplacedQueryUrl(query);
      window.history.replaceState({}, '', nextUrl);
      refetch(nextUrl, router);
    };

    singletone.clearAll = () => {
      router.replace(window.location.pathname, { scroll: false });
    };
  }, [router]);

  return singletone;
};
