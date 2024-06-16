'use client';

import { selectSearchVacancyHistories } from '@web/providers/redux/slices/search-slice';
import {
  deleteSearchVacancyHistories,
  fetchSearchVacancyHistories,
} from '@web/providers/redux/slices/search-slice/asyncActions';
import { useReduxResource } from '@web/shared/lib/hooks/useReduxResource';
import { Badge } from '@web/shared/ui/Badge';
import { Heading } from '@web/shared/ui/Heading';
import { Loader } from '@web/shared/ui/Loader';
import { FC } from 'react';
import { RxCross1 } from 'react-icons/rx';

export type SearchHistoryListProps = {
  includeText?: string;
};

export const SearchHistoryList: FC<SearchHistoryListProps> = ({
  includeText,
}) => {
  const {
    select: { data, loading },
    backend,
    dispatch,
  } = useReduxResource({
    selector: selectSearchVacancyHistories,
    fetcher: ({ api }) => {
      return fetchSearchVacancyHistories({ includeText: '', api });
    },
    deps: [includeText],
  });

  if (!data?.length && loading) {
    return <Loader className='text-center mt-4' />;
  }

  if (!data?.length) return null;

  return (
    <div className='py-2'>
      <Heading level={4}>Популярные поисковые запросы:</Heading>
      <div className='flex flex-wrap gap-2 mt-2'>
        {data.map((searchHistory) => (
          <Badge
            key={searchHistory.id}
            text={searchHistory.searchText}
            iconEnd={
              <RxCross1
                size={12}
                className='cursor-pointer'
                onClickCapture={() => {
                  dispatch(
                    deleteSearchVacancyHistories({
                      id: searchHistory.id,
                      api: backend.api,
                    }),
                  );
                }}
              />
            }
          />
        ))}
      </div>
    </div>
  );
};
