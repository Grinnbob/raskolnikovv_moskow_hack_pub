'use client';

import IconButton from '@web/shared/ui/buttons/IconButton';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { twMerge } from 'tailwind-merge';
import { RxCrossCircled } from 'react-icons/rx';
import { useClickOutside } from '@web/shared/lib/hooks/useClickOutside';
import styles from './styles.module.scss';
import Portal from '@web/entities/Portal';
import { Heading } from '@web/shared/ui/Heading';
import { BestCompaniesInfo } from '@web/features/BestCompanies';
import { RiMailSendLine } from 'react-icons/ri';
import debounce from 'lodash.debounce';
import { useRouter } from 'next/navigation';
import { DropDown } from '@web/entities/DropDown';
import { Radio } from '@web/shared/ui/form/Radio';
import { useUrlParamsApi } from '@web/shared/lib/hooks/useUrlParamsApi';
import { FilterForm } from '@web/entities/FilterForm';
import { CompanyModel } from '@web/shared/types/models/company.model';
import { SearchHistoryModel } from '@web/shared/types/models/searchHistory';
import { FilterModel } from '@web/shared/types/models/filter';
import { SavedFilters } from './ui/SavedFilters';
import { SearchHistoryList } from '@web/features/SimilarQueries/ui/SearchHistoryList';
import QueryString from 'qs';

const searchByConst = [
  { label: 'Вакансии', value: 'vacancy' },
  { label: 'Резюме', value: 'resume' },
  { label: 'Компании', value: 'company' },
] as const;

export type MainSearchProps = React.HTMLAttributes<HTMLInputElement> & {
  value?: string;
  searchBy?: string;
  companies?: CompanyModel[];
  searchHistories?: SearchHistoryModel[];
  savedFilters?: FilterModel[];
  redirectOnSearch?: string;
};

const twWidth = 'xl:w-[720px] lg:w-[550px] md:w-[400px]';

export const MainSearch: FC<MainSearchProps> = ({
  className,
  value,
  searchBy,
  companies,
  savedFilters,
  redirectOnSearch,
  ...props
}) => {
  const apiFilters = useUrlParamsApi();
  const [search, setSearch] = useState(value || '');
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const onOpen = () => {
    setFocused(true);
  };

  const onClose = () => {
    setFocused(false);
  };

  const debounceSetSearch = useCallback(
    debounce((text?: string) => {
      if (text && redirectOnSearch) {
        return router.push(`${redirectOnSearch}?includeText=${text}`);
      }
      apiFilters.applyFilter?.('includeText', text || '');
      onClose();
    }, 1000),
    [router, setFocused, redirectOnSearch],
  );

  useEffect(() => {
    debounceSetSearch(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useClickOutside(ref, onClose);

  const rect = useMemo(() => {
    return ref.current?.getBoundingClientRect();
  }, [focused]);

  return (
    <>
      {focused && <div className='h-[46px]'></div>}
      <Portal show={focused} renderChildrenOnHide>
        <div
          className={twMerge(
            twWidth,
            styles.content,
            focused && styles.focusedContent,
            className,
          )}
          ref={ref}
          style={
            focused
              ? { position: 'relative', top: (rect?.top || 20) - 20 }
              : undefined
          }
        >
          <div
            className={twMerge(
              twWidth,
              'flex bg-appGray rounded-[28px] text-sm items-center h-[46px] gap-2 p-[2px] relative',
              className,
            )}
          >
            <DropDown
              text={
                searchByConst.find((search) => search.value === searchBy)
                  ?.label || searchByConst[0].label
              }
              variant='add'
              classNameBtn='text-mainRed h-full bg-white enabled:hover:bg-addRed'
              className='h-full'
              content={searchByConst}
              renderContent={(isOpen, content) => {
                return (
                  <FilterForm
                    className='flex flex-col gap-2'
                    onChange={(name, value) => {
                      apiFilters.applyFilter?.(name, value);
                    }}
                  >
                    {content?.map((cat) => (
                      <Radio
                        key={cat.value}
                        label={cat.label}
                        value={cat.value}
                        name='searchBy'
                        checked={searchBy === cat.value}
                      />
                    ))}
                  </FilterForm>
                );
              }}
            />
            <input
              type='text'
              className='h-[40px] rounded-[28px] block w-full ps-10 p-2 bg-appGray border-none focus:ring-0 z-10'
              placeholder='Поиск...'
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={onOpen}
              autoFocus={focused}
              {...props}
            />
            <IconButton
              icon={RxCrossCircled}
              className={!search ? 'invisible' : ''}
              variant='ghost'
              size='32px'
              color='rgba(161, 160, 179, 1)'
              onClick={() => setSearch('')}
            />
          </div>
          {focused && (
            <div className='flex justify-center gap-y-4 gap-x-8 pt-8 w-full h-[400px] scrollable'>
              <aside className='w-2/3'>
                <SearchHistoryList includeText={value} />
                <SavedFilters
                  onClose={onClose}
                  initialData={savedFilters}
                  onChoose={(filter) => {
                    if (redirectOnSearch) {
                      return router.push(
                        `${redirectOnSearch}?${QueryString.stringify(filter.query, { arrayFormat: 'repeat' })}`,
                      );
                    }
                    apiFilters.applyFiltersBulk?.(filter.query);
                  }}
                />
                <div className='mt-6'>
                  <Heading level={4}>Полезные статьи для вас</Heading>
                  <div className='flex flex-wrap gap-2 mt-2'>
                    <div className='p-[12px] h-[150px] flex flex-col justify-between items-start border-strokeLight border rounded-xl w-[200px]'>
                      <RiMailSendLine
                        size='32px'
                        color='rgba(98, 148, 176, 1)'
                      />
                      <Heading level={5}>Пишем сопроводительное</Heading>
                    </div>
                    <div className='p-[12px] h-[150px] flex flex-col justify-between items-start border-strokeLight border rounded-[12px] w-[200px]'>
                      <RiMailSendLine
                        size='32px'
                        color='rgba(98, 148, 176, 1)'
                      />
                      <Heading level={5}>Резюме: заполняем правильно</Heading>
                    </div>
                  </div>
                </div>
              </aside>
              <aside className='w-1/3'>
                <BestCompaniesInfo companies={companies} />
              </aside>
            </div>
          )}
        </div>
      </Portal>
    </>
  );
};
