'use client';

import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { FC, useEffect } from 'react';
import { CgOptions } from 'react-icons/cg';
import { RxCross1 } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';
import { useDispatch, useSelector } from 'react-redux';
import {
  isSearchFiltersOpen,
  toggleSearchFilters,
} from '@web/providers/redux/slices/general-slice';
import { DropDown, DropDownLazy } from '@web/entities/DropDown';
import { RangeInput } from '@web/entities/RangeInput/RangeInput';
import { useUrlParamsApi } from '@web/shared/lib/hooks/useUrlParamsApi';
import { FilterForm } from '@web/entities/FilterForm';
import {
  qualificationLevelMap,
  jobTypeMap,
} from '@web/shared/const/languageMappers';
import { useBackend } from '@web/shared/lib/hooks/useBackend';
import { CategoryModel } from '@web/shared/types/models/category.model';
import { useRenderCheckbox } from '../lib/useRenderCheckbox';
import { getDropDownText } from '../lib/getDropDownText';

export type ToolBarPanelProps = {
  categories?: CategoryModel[];
  filters: Record<string, string | string[]>;
  asideId: string;
  recomendationsClassname: string;
  filteredClassName: string;
};

export const ToolBarPanel: FC<ToolBarPanelProps> = ({
  filters,
  asideId,
  recomendationsClassname,
  filteredClassName,
}) => {
  const isOpen = useSelector(isSearchFiltersOpen);
  const dispatch = useDispatch();
  const backend = useBackend();
  const api = useUrlParamsApi();
  const renderCheckboxes = useRenderCheckbox(filters);

  useEffect(() => {
    const element = document.getElementById(asideId);

    if (!element) return;

    if (isOpen) {
      element.classList.remove(recomendationsClassname);
      element.classList.add(filteredClassName);
    } else {
      element.classList.remove(filteredClassName);
      element.classList.add(recomendationsClassname);
    }
  }, [isOpen]);

  return (
    <FilterForm
      className='my-4 w-full flex gap-4 items-center'
      name='vacancyFiltersToolbar'
      onChange={(name, values) => {
        api.applyFilter?.(name, values);
      }}
    >
      <AppButton
        onClick={() => dispatch(toggleSearchFilters())}
        className={twMerge(
          'h-11 px-4',
          isOpen && 'text-white bg-black enabled:hover:bg-black',
        )}
        icon={<CgOptions size={24} className='p-1 box-content' />}
      >
        Фильтры
      </AppButton>
      <DropDown
        classNameBtn='h-11 px-4'
        text={getDropDownText(filters.jobTypes as Array<string>, 'Тип работы')}
      >
        {renderCheckboxes(false, jobTypeMap, 'jobTypes')}
      </DropDown>
      <DropDown
        classNameBtn='h-11 px-4'
        text={
          filters.salaryMin || filters.salaryMax
            ? `Зарплата: ${filters.salaryMin || 0} - ${filters.salaryMax || '∞'}`
            : 'Зарплата'
        }
      >
        <RangeInput
          fromName='salaryMin'
          toName='salaryMax'
          className='w-40'
          min={0}
          defaultMin={filters.salaryMin as string}
          defaultMax={filters.salaryMax as string}
        />
      </DropDown>
      <DropDownLazy
        classNameBtn='h-11 px-4'
        text={getDropDownText(filters.categoryIds as Array<string>, 'Cфера')}
        fetchData={backend.api.getCategories}
        renderContent={renderCheckboxes}
        name='categoryIds'
      />
      <DropDown
        classNameBtn='h-11 px-4'
        text={getDropDownText(
          filters.qualificationLevels as Array<string>,
          'Квалификация',
        )}
      >
        {renderCheckboxes(false, qualificationLevelMap, 'qualificaionLevels')}
      </DropDown>
      <AppButton
        onClick={api.clearAll}
        className={twMerge('h-11 px-4')}
        icon={<RxCross1 size={12} className='p-[4px] box-content' />}
      >
        Сбросить фильтры
      </AppButton>
    </FilterForm>
  );
};
