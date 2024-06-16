'use client';

import {
  setNavLinks,
  toggleSearchFilters,
} from '@web/providers/redux/slices/general-slice';
import { DEFAULT_NAV_LINKS } from '@web/shared/const/config';
import { Heading } from '@web/shared/ui/Heading';
import { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import IconButton from '@web/shared/ui/buttons/IconButton';
import { twMerge } from 'tailwind-merge';
import {
  companySizeMap,
  isPartTimeVariants,
  teamLeadTemperMap,
  teamMethodologyMap,
  teamSizeMap,
  workLocationTypeMap,
} from '@web/shared/const/languageMappers';
import { Checkbox } from '@web/shared/ui/form/Checkbox';
import { Divider } from '@web/shared/ui/Divider';
import { useUrlParamsApi } from '@web/shared/lib/hooks/useUrlParamsApi';
import { FilterForm } from '@web/entities/FilterForm';
import { useBackend } from '@web/shared/lib/hooks/useBackend';
import { SkillModel } from '@web/shared/types/models/skills.model';
import { WorkExpirience } from './WorkExpirience';
import { DropDown, DropDownLazy } from '@web/entities/DropDown';
import { Input } from '@web/shared/ui/form/Input';
import { WithCount } from '@web/shared/ui/form/ui/WithCount';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { CityModel } from '@web/shared/types/models/city.model';
import { CustomAutocomplete } from './CustomAutocomplete';
import { CompanyModel } from '@web/shared/types/models/company.model';
import { SearchType } from '@web/shared/types/models/searchHistory';
import { useRenderCheckbox } from '../lib/useRenderCheckbox';
import { getDropDownText } from '../lib/getDropDownText';

export type FiltersBlockProps = {
  filters: Record<string, string | string[]>;
  skills: SkillModel[];
  cities: CityModel[];
  companies: CompanyModel[];
};

export const FiltersBlock: FC<FiltersBlockProps> = ({
  filters,
  skills,
  cities,
  companies,
}) => {
  const backend = useBackend({ trackState: true });
  const paramsApi = useUrlParamsApi();
  const dispatch = useDispatch();
  const [hasScroll, setHasScroll] = useState(false);
  const [filterTitle, setFilterTitle] = useState<string>();
  const renderCheckboxesGroup = useRenderCheckbox(filters);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const listener = () => {
      setHasScroll(window.scrollY > 0);
    };

    document.addEventListener('scroll', listener);

    return () => {
      document.removeEventListener('scroll', listener);
    };
  }, []);

  useEffect(() => {
    if (hasScroll) {
      dispatch(setNavLinks([]));
    } else {
      dispatch(setNavLinks(DEFAULT_NAV_LINKS));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasScroll]);

  return (
    <FilterForm
      className='text-black flex flex-col gap-4'
      onChange={(name, values) => {
        paramsApi.applyFilter?.(name, values);
      }}
      name='vacancyFilters'
    >
      <div className='flex justify-between items-center'>
        <Heading level={3}>Фильтры</Heading>
        <IconButton
          icon={FaArrowRightFromBracket}
          className={twMerge(
            'bg-black p-[4px] text-white rounded-full opacity-0 pointer-events-none duration-30',
            hasScroll && 'opacity-1 transition-opacity pointer-events',
          )}
          onClick={() => dispatch(toggleSearchFilters())}
        />
      </div>
      <div>
        <Heading level={4}>Тип занятости</Heading>
        <div className='flex flex-col gap-2 mt-2'>
          {isPartTimeVariants.map((variant) => (
            <WithCount key={String(variant.value)} count={1}>
              <Radio
                label={variant.label}
                value={String(variant.value)}
                name='isPartTime'
                checked={
                  !variant.value
                    ? !filters.isPartTime
                    : filters.isPartTime === String(variant.value)
                }
              />
            </WithCount>
          ))}
        </div>
        <div  />
        <Heading level={4}>График работы</Heading>
        <div className='flex flex-col gap-2 mt-2'>
          <WithCount key='isFlexibleSchedule' count={1}>
            <Checkbox
              name='isFlexibleSchedule'
              value='true'
              label='Гибкий график'
              checked={filters.isFlexibleSchedule === 'true'}
            />
          </WithCount>
          <WithCount key='isShiftWork' count={1}>
            <Checkbox
              name='isShiftWork'
              value='true'
              label='Работа по сменам'
              checked={filters.isShiftWork === 'true'}
            />
          </WithCount>
          <WithCount key='isRatationalWork' count={1}>
            <Checkbox
              name='isRatationalWork'
              value='true'
              label='Вахтовая работа'
              checked={filters.isRatationalWork === 'true'}
            />
          </WithCount>
        </div>
        <Divider  />
        <Checkbox
          name='isReferral'
          value='true'
          label='Есть реферальная программа'
          checked={filters.isReferral === 'true'}
        />
        <div/>
        <Checkbox
          name='isSelfEmployed'
          value='true'
          label='Оформление по ГПХ или по совместительству'
          checked={filters.isSelfEmployed === 'true'}
        />
      </div>
      <Divider className='my-2' />
      <WorkExpirience
        defaultMax={filters.workExperienceYearsMax as string}
        defaultMin={filters.workExperienceYearsMin as string}
      />
      <Divider className='my-2' />
      <CustomAutocomplete
        header='Ключевые навыки'
        name='skillIds'
        items={skills}
        itemIds={filters.skillIds}
        renderCheckboxes={renderCheckboxesGroup}
      />
      <div>
        <Heading level={4}>Языки</Heading>
        <DropDownLazy
          classNameBtn='mt-2 h-[44px] px-[16px] bg-white rounded-[8px] w-full'
          text={getDropDownText(filters.languageIds as Array<string>)}
          fetchData={backend.api.getLanguages}
          renderContent={renderCheckboxesGroup}
          name='languageIds'
        />
      </div>
      <div>
        <Heading level={4}>Плюшки</Heading>
        <DropDownLazy
          classNameBtn='mt-2 h-[44px] px-[16px] bg-white rounded-[8px] w-full'
          text={getDropDownText(filters.benefitIds as Array<string>)}
          fetchData={backend.api.getBenefits}
          renderContent={renderCheckboxesGroup}
          name='benefitIds'
        />
      </div>
      <Divider className='my-2' />
      <Heading level={3}>Где работать?</Heading>
      <div className='flex flex-col gap-2 mt-2'>
        {workLocationTypeMap.map((variant) => (
          <WithCount key={String(variant.value)} count={1}>
            <Radio
              label={variant.label}
              value={String(variant.value)}
              name='workLocationType'
              checked={
                !variant.value
                  ? !filters.workLocationType
                  : filters.workLocationType === String(variant.value)
              }
            />
          </WithCount>
        ))}
      </div>
      <Heading level={5}>Города</Heading>
      <CustomAutocomplete
        name='cityIds'
        items={cities}
        itemIds={filters.cities}
        renderCheckboxes={renderCheckboxesGroup}
      />
      <Divider className='my-2' />
      <div className='flex-col gap-2 mt-2'>
        <Heading level={3}>Компания</Heading>
        <WithCount key='isStartup' count={1}>
          <Checkbox
            name='isStartup'
            value='true'
            label='Стартапы'
            checked={filters.isStartup === 'true'}
          />
        </WithCount>
        <WithCount key='isVerified' count={1}>
          <Checkbox
            name='isVerified'
            value='true'
            label='Проверенные компании'
            checked={filters.isVerified === 'true'}
          />
        </WithCount>
        <Heading level={5}>Отрасль компании</Heading>
        <DropDownLazy
          classNameBtn='mt-2 h-[44px] px-[16px] bg-white rounded-[8px] w-full'
          text={getDropDownText(filters.industryIds as Array<string>)}
          fetchData={backend.api.getIndustries}
          renderContent={renderCheckboxesGroup}
          name='industryIds'
        />
        <Heading level={5}>Названия компаний</Heading>
        <CustomAutocomplete
          name='companyIds'
          items={companies}
          itemIds={filters.companyIds}
          renderCheckboxes={renderCheckboxesGroup}
        />
        <Heading level={5}>Размер компании</Heading>
        <DropDown
          classNameBtn='mt-2 h-[44px] px-[16px] bg-white rounded-[8px] w-full'
          text={getDropDownText(filters.companySizes as Array<string>)}
          name='companySizes'
        >
          {renderCheckboxesGroup(false, companySizeMap, 'companySizes')}
        </DropDown>
      </div>
      <Divider className='my-2' />
      <div className='flex flex-col gap-2 mt-2'>
        <Heading level={3}>Команда</Heading>
        <Heading level={5}>Методологии в команде</Heading>
        <DropDown
          classNameBtn='mt-2 h-[44px] bg-white rounded-[8px] w-full'
          text={getDropDownText(filters.teamMethodologies as Array<string>)}
        >
          {renderCheckboxesGroup(
            false,
            teamMethodologyMap,
            'teamMethodologies',
          )}
        </DropDown>
        <Heading level={5}>Размер команды</Heading>
        <DropDown
          classNameBtn='mt-2 px-[16px] bg-white rounded-[8px] w-full'
          text={getDropDownText(filters.teamSizes as Array<string>)}
        >
          {renderCheckboxesGroup(false, teamSizeMap, 'teamSizes')}
        </DropDown>
        <Heading level={5}>Атмосфера в команде</Heading>
        <DropDown
          classNameBtn='mt-2 h-[44px] px-[16px] bg-white rounded-[8px] w-full'
          text={getDropDownText(filters.teamLeadTempers as Array<string>)}
        >
          {renderCheckboxesGroup(false, teamLeadTemperMap, 'teamLeadTempers')}
        </DropDown>
      </div>
      <Divider className='my-2' />
      <div>
        <Heading level={4}>Слова исключения</Heading>
        <Input
          name='excludeText'
          placeholder='Отчёты, собрания...'
          className='mt-2'
          defaultValue={filters.excludeText}
        />
      </div>
      <div className='flex flex-col gap-2 mt-2'>
        <Heading level={4}>Возраст</Heading>
        <WithCount key='isForStudents' count={1}>
      </div>
      <Divider className='my-2' />
      <div className='flex flex-col gap-2'>
        <Heading level={4}>Другие параметры</Heading>
        <WithCount key='isAllowedWithDisability' count={1}>
          <Checkbox
            name='isAllowedWithDisability'
            value='true'
            label='Доступно для людей с ограничениями'
            checked={filters.isAllowedWithDisability === 'true'}
          />
        </WithCount>
        <WithCount key='isInternship' count={1}>
          <Checkbox
            name='isInternship'
            value='true'
            label='Стажировка'
            checked={filters.isInternship === 'true'}
          />
        </WithCount>
        <WithCount key='isVolonteering' count={1}>
          <Checkbox
            name='isVolonteering'
            value='true'
            label='Волонтёрство'
            checked={filters.isVolonteering === 'true'}
          />
        </WithCount>
      </div>
      <div className='mt-4'>
        <Input
          placeholder='Название фильтра...'
          className='mt-2'
          onChange={(event) => {
            setFilterTitle((event?.target as any)?.value);
          }}
        />
      </div>
      <div>
        <AppButton
          variant='accept'
          size='l'
          className='mb-2 bg-textBlue'
          full
          onClick={() =>
            backend.api.upsertFilter({
              title: filterTitle,
              query: filters,
              searchType: SearchType.VACANCY,
            })
          }
          pending={backend.pending.upsertFilter}
        >
          Сохранить набор фильтров
        </AppButton>
        <AppButton
          variant='cancel'
          size='l'
          icon={<RxCross1 size={12} />}
          full
          onClick={paramsApi.clearAll}
        >
          Сбросить фильтры
        </AppButton>
    </FilterForm>
  );
};
