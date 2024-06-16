import { MainSearch } from '@web/widgets/MainSearch';
import React from 'react';
import styles from './styles.module.scss';
import { Heading } from '@web/shared/ui/Heading';
import { Text } from '@web/shared/ui/Text';
import { twMerge } from 'tailwind-merge';
import { VacancyCard } from '@web/features/VacancyCard';
import { VacancyCardCompact } from '@web/features/VacancyCard/VacancyCardCompact';
import { BestCompaniesBlock } from '@web/features/BestCompanies';
import { AdviceBlock } from '@web/entities/AdviceBlock';
import { SimilarQueries } from '@web/features/SimilarQueries';
import { getBackendApiSSR } from '@web/shared/services/BackendAPI';
import { SearchPageQueryParams } from '@web/shared/types/params';
import { LoadMore } from '@web/widgets/LoadMore';
import { FakePagination } from '@web/shared/ui/FakePagination';
import Qs from 'qs';
import { redirect } from 'next/navigation';
import { getTextFromError } from '@web/shared/lib/getTextFromError';
import QueryString from 'qs';
import { FiltersBlock, ToolBarPanel } from '@web/features/Search';

type SearchPageProps = {
  searchParams: SearchPageQueryParams | undefined;
};

export const GRID_ID = 'vacanciesGrid';

async function SearchPage({ searchParams = {} }: SearchPageProps) {
  const pageNum = Number(searchParams.page) || 1;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { page, pageSize, error, ...filters } = searchParams;
  const { api, session } = await getBackendApiSSR(true);
  const [data, recommendationsData, skills, cities, companies, bestCompanies] =
    await Promise.all([
      api.getPaginatedVacancies(searchParams),
      api.getRecommendationsVacancies(),
      api.getSkills(),
      api.getCities(),
      api.getCompanies(),
      api.getBestCompanies(),
    ]).catch(async (e) => {
      const error = await getTextFromError(e);
      redirect(`/search?${QueryString.stringify({ error })}`);
    });

  const noResults = !data.results.length;
  const hasMore = !noResults && data.info.pagesTotal > pageNum;

  return (
    <div className='w-full flex flex-col justify-center items-center'>
      <div className='bg-white z-50 flex flex-col items-center justify-center sticky top-3'>
        <MainSearch
          searchBy={filters.searchBy}
          companies={bestCompanies}
          value={filters.includeText}
        />
      </div>
      <div className='flex flex-start gap-4 my-4 w-full items-center'>
        <Heading level={2}>Вакансии</Heading>
        <Text color='secondary' size='s' className='mt-1'>
          Найдено {data.info.resultsTotal ? data.info.resultsTotal : 0}
        </Text>
      </div>
      <ToolBarPanel
        filters={filters}
        asideId={GRID_ID}
        recomendationsClassname={styles.recomendations}
        filteredClassName={styles.filtered}
      />
      <div
        id={GRID_ID}
        className={twMerge(
          `w-full`,
          'text-white',
          styles.grid,
          styles.recomendations,
        )}
      >
        <aside
          className={twMerge(
            `sticky z-1 mr-3 bg-appGray rounded-2xl p-5 scrollable`,
            styles.filters,
          )}
        >
          <FiltersBlock
            filters={filters}
            skills={skills}
            cities={cities}
            companies={companies}
          />
        </aside>
        <div className='grow-1 z-10 bg-white pr-3 flex flex-col gap-6'>
          {noResults ? (
            <Text className='block text-center'>Ничего не найдено</Text>
          ) : (
            data?.results?.map((vacancy) => (
              <VacancyCard
                key={vacancy.id}
                item={vacancy}
                nowDate={new Date()}
              />
            ))
          )}
          {hasMore && (
            <LoadMore
              initialParams={{
                ...searchParams,
                page: pageNum + 1,
                pageSize: 10,
              }}
              mode='search'
            />
          )}
          <FakePagination
            page={pageNum}
            query={Qs.stringify(filters, { arrayFormat: 'repeat' })}
            hasMore={hasMore}
          />
        </div>
        <aside className='bg-white flex flex-col gap-6'>
          <div className='flex flex-col gap-6 pt-3'>
            {recommendationsData?.map((rec) => (
              <VacancyCardCompact key={rec?.id} vacancy={rec} />
            ))}
          </div>
          <BestCompaniesBlock companies={bestCompanies} />
          <AdviceBlock />
          <SimilarQueries includeText={filters.includeText} />
        </aside>
      </div>
    </div>
  );
}

export default SearchPage;
