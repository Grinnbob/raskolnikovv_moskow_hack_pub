'use client';

import { Heading } from '@web/shared/ui/Heading';
import { InfoBlock } from '@web/shared/ui/InfoBlock';
import { SimilarButton } from './ui/CompanyButton';
import { FC } from 'react';
import { selectSearchVacancyHistories } from '@web/providers/redux/slices/search-slice';
import { useReduxResource } from '@web/shared/lib/hooks/useReduxResource';
import { fetchSearchVacancyHistories } from '@web/providers/redux/slices/search-slice/asyncActions';

type SimilarQueriesProps = {
  includeText?: string;
};

export const SimilarQueries: FC<SimilarQueriesProps> = ({ includeText }) => {
  const {
    select: { data },
  } = useReduxResource({
    selector: selectSearchVacancyHistories,
    fetcher: ({ api }) => {
      return fetchSearchVacancyHistories({ includeText: '', api });
    },
    deps: [includeText],
  });

  if (!data?.length) return null;

  return (
    <InfoBlock variant='error'>
      <Heading level={4} className='mb-1'>
        Похожие запросы
      </Heading>
      <div>
        {data.map((searchHistory) => (
          <SimilarButton
            key={searchHistory.id || searchHistory.searchText}
            name={searchHistory.searchText}
            count={searchHistory.globalFrequency}
          />
        ))}
      </div>
    </InfoBlock>
  );
};
