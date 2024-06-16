'use client';

import { Switch } from '@web/shared/ui/form/Switch';
import { Input } from '@web/shared/ui/form/Input';
import { TextArea } from '@web/shared/ui/form/TextArea';
import { Divider } from '@web/shared/ui/Divider';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import {
  driveLicenseMap,
  educationTypeMap,
  qualificationLevelMap,
  salaryCurrencyMap,
  teamMethodologyMap,
  teamSizeMap,
  jobTypeMap,
  workLocationTypeMap,
} from '@web/shared/const/languageMappers';
import { MultichoiceChips, PseudoSelect } from '@web/entities/PseudoSelect';
import { Text } from '@web/shared/ui/Text';
import { FC } from 'react';
import { Heading } from '@web/shared/ui/Heading';
import { WorkLocationType } from '@web/shared/types/enums/resume-vacancy';
import { useVacancyForm } from '@web/providers/create-vacancy-form';
import { LanguagesSelect } from './ui/LanguagesSelect';
import { Checkbox } from '@web/shared/ui/form/Checkbox';
import { findByKey, getIntersected } from '@web/shared/lib/getDefaultSelection';

export type VacancyInfoFormProps = {};

const setValueParams = {
  shouldValidate: true,
  shouldDirty: true,
};

const VacancyInfoForm: FC<VacancyInfoFormProps> = () => {
  const {
    categories,
    skills,
    benefits,
    languages,
    citezenships,
    cities,
    form: {
      register,
      formState: { errors },
      watch,
      setValue,
      getValues,
    },
    onNext,
  } = useVacancyForm();

  const values = getValues();
  return (
    <>
      <div className='flex justify-between mt-5'>
        <Heading level={2}>О вакансии</Heading>
      </div>
      <div className='flex flex-col gap-4'>
        <Input
          placeholder='Введите реальное название'
          className='bg-appGray'
          label='Название'
          error={errors.title?.message}
          {...register('title')}
        />
        <TextArea
          className='bg-appGray'
          placeholder='Расскажите о компании, достижениях, чем занимаетесь,
Избегайте длинных формулировок, чтобы не утомить'
          label='Описание'
          error={errors.description?.message}
          {...register('description')}
        />
        <div>
          <Text size='s' className='font-medium mb-2 block'>
            Зарплата
          </Text>
          <div className='flex gap-4 w-full justify-between'>
            <Input
              placeholder='От'
              className='bg-appGray'
              classNameWrapper='w-1/3 grow'
              error={errors.salaryMin?.message}
              type='number'
              {...register('salaryMin')}
            />
            <Input
              placeholder='До'
              className='bg-appGray'
              classNameWrapper='w-1/3 grow'
              error={errors.salaryMax?.message}
              type='number'
              {...register('salaryMax')}
            />
            <PseudoSelect
              data={salaryCurrencyMap}
              defaultSelected={salaryCurrencyMap.find(
                (currency) => currency.value === values.salaryCurrency,
              )}
              renderOption={(item) => <Text size='s'>{item.label}</Text>}
              onChange={(item) => {
                setValue('salaryCurrency', item.value, setValueParams);
              }}
              multiple={false}
              className='w-1/5'
              error={errors.salaryCurrency?.message}
            />
          </div>
        </div>
        <div>
          <Text size='s' className='font-medium mb-2 block'>
            Cпециализация
          </Text>
          <div className='flex gap-4 w-full justify-start'>
            <PseudoSelect
              data={categories}
              defaultSelected={findByKey(categories, values.category?.id, {
                sourceKey: 'id',
              })}
              renderOption={(item) => <Text size='s'>{item.title}</Text>}
              onChange={(item) => setValue('category', item, setValueParams)}
              multiple={false}
              className='w-1/2 grow'
              error={errors.category?.message}
            />
            <PseudoSelect
              data={qualificationLevelMap}
              defaultSelected={findByKey(
                qualificationLevelMap,
                values.qualificationLevel,
                {
                  sourceKey: 'value',
                },
              )}
              renderOption={(item) => <Text size='s'>{item.label}</Text>}
              onChange={(item) =>
                setValue('qualificationLevel', item.value, setValueParams)
              }
              multiple={false}
              className='w-1/3'
              error={errors.qualificationLevel?.message}
            />
          </div>
        </div>
        <div>
          <Text size='s' className='font-medium mb-2 block'>
            Опыт, лет
          </Text>
          <div className='flex gap-4 w-full justify-between'>
            <Input
              placeholder='От'
              className='bg-appGray'
              classNameWrapper='w-1/3 grow'
              error={errors.workExperienceYearsMin?.message}
              type='number'
              {...register('workExperienceYearsMin')}
            />
            <Input
              placeholder='До'
              className='bg-appGray'
              classNameWrapper='w-1/3 grow'
              error={errors.workExperienceYearsMax?.message}
              type='number'
              {...register('workExperienceYearsMax')}
            />
          </div>
        </div>
        <div className='flex justify-between mt-5'>
          <Heading level={2}>Основное</Heading>
        </div>
        <TextArea
          className='bg-appGray'
          placeholder='Перечислите списком, что предстоит делать кандидату?'
          label='Обязанности'
          error={errors.responsibilities?.message}
          {...register('responsibilities')}
        />
        <TextArea
          className='bg-appGray'
          placeholder='Перечислите списком, что вы ожидаете от кандидата?'
          label='Требования'
          error={errors.requirements?.message}
          {...register('requirements')}
        />
        <MultichoiceChips
          label='Навыки'
          className='w-1/2'
          data={skills}
          defaultSelected={getIntersected(skills, values.skills, {
            sourceKey: 'title',
            targetKey: 'title',
          })}
          // TODO: поддержка Skills на бекенде?
          onChange={(items) => setValue('skills', items, setValueParams)}
          error={errors.skills?.message}
        />
        <TextArea
          className='bg-appGray'
          placeholder='Укажите условия работы, не забудьте отметить преимущества, 
          например, оплату спорта или ДМС'
          label='Требования'
          error={errors.conditions?.message}
          {...register('conditions')}
        />
        <MultichoiceChips
          label='Плюшки'
          className='w-1/2'
          data={benefits}
          defaultSelected={getIntersected(benefits, values.benefits, {
            sourceKey: 'title',
            targetKey: 'title',
          })}
          onChange={(items) => setValue('benefits', items, setValueParams)}
          error={errors.benefits?.message}
        />
        <div className='flex justify-between mt-5'>
          <Heading level={2}>Формат работы</Heading>
        </div>
        <div>
          <Text size='s' className='font-medium mb-2 block'>
            Тип работы
          </Text>
          <div className='grid grid-cols-2 gap-4'>
            <PseudoSelect
              data={jobTypeMap}
              defaultSelected={findByKey(jobTypeMap, values.jobType, {
                sourceKey: 'value',
              })}
              renderOption={(item) => <Text size='s'>{item.label}</Text>}
              onChange={(item) => {
                setValue('jobType', item.value, setValueParams);
              }}
              multiple={false}
              error={errors.jobType?.message}
            />
            <PseudoSelect
              data={workLocationTypeMap}
              defaultSelected={findByKey(
                workLocationTypeMap,
                values.workLocationType,
                {
                  sourceKey: 'value',
                },
              )}
              renderOption={(item) => <Text size='s'>{item.label}</Text>}
              onChange={(item) => {
                setValue('workLocationType', item.value, setValueParams);
              }}
              multiple={false}
              error={errors.workLocationType?.message}
            />
            {watch('workLocationType') !== WorkLocationType.REMOTE && (
              <PseudoSelect
                data={cities}
                label='Офис'
                defaultSelected={findByKey(cities, values.city?.name, {
                  sourceKey: 'name',
                })}
                renderOption={(item) => <Text size='s'>{item.name}</Text>}
                onChange={(item) => {
                  setValue('city', item, setValueParams);
                }}
                multiple={false}
                error={errors.city?.name?.message}
              />
            )}
          </div>
        </div>
        <Switch
          label='Возможны командировки'
          {...register('isReadyForBusinessTrip')}
        />
        <div className='grid grid-cols-2 gap-4'>
          <PseudoSelect
            label='Размер команды'
            data={teamSizeMap}
            defaultSelected={findByKey(teamSizeMap, values.teamSize, {
              sourceKey: 'value',
            })}
            renderOption={(item) => <Text size='s'>{item.label}</Text>}
            onChange={(item) =>
              setValue('teamSize', item.value, setValueParams)
            }
            error={errors.teamSize?.message}
            multiple={false}
          />
          <PseudoSelect
            label='Методология в команде'
            data={teamMethodologyMap}
            defaultSelected={findByKey(teamMethodologyMap, values.teamSize, {
              sourceKey: 'value',
            })}
            renderOption={(item) => <Text size='s'>{item.label}</Text>}
            onChange={(item) =>
              setValue('teamMethodology', item.value, setValueParams)
            }
            error={errors.teamMethodology?.message}
            multiple={false}
          />
        </div>
        <Switch
          label='Оформление по ГПХ, ИП, самозанятости'
          {...register('isSelfEmployed')}
        />
        <div className='flex justify-between mt-5'>
          <Heading level={2}>Дополнительно</Heading>
        </div>
        <MultichoiceChips
          label='Гражданства'
          className='w-1/2'
          defaultSelected={getIntersected(citezenships, values.citizenships, {
            sourceKey: 'title',
            targetKey: 'title',
          })}
          data={citezenships}
          // TODO: citezenships на беке ?
          onChange={(items) => setValue('citizenships', items, setValueParams)}
          error={errors.citizenships?.message}
        />
        <MultichoiceChips
          label='Уровень образования'
          className='w-1/2'
          defaultSelected={getIntersected(
            educationTypeMap,
            values.educationTypes,
            {
              sourceKey: 'value',
            },
          )}
          data={educationTypeMap}
          onChange={(items) =>
            setValue(
              'educationTypes',
              items.filter(Boolean).map((item) => item.value!),
              setValueParams,
            )
          }
          error={errors.educationTypes?.message}
        />
        <LanguagesSelect
          selectedLanguages={values.languages}
          languages={languages}
          onChange={(items) => {
            setValue('languages', items, setValueParams);
          }}
        />
        <MultichoiceChips
          defaultSelected={getIntersected(
            driveLicenseMap,
            values.driveLicenses,
            {
              sourceKey: 'value',
            },
          )}
          label='Водительские права'
          className='w-1/2'
          data={driveLicenseMap}
          onChange={(items) =>
            setValue(
              'driveLicenses',
              items.map((item) => item.value),
              setValueParams,
            )
          }
          error={errors.driveLicenses?.message}
        />
        <div className='flex justify-between mt-5'>
          <Heading level={2}>Доступна также для</Heading>
        </div>
        <div className='flex gap-4 flex-wrap'>
          <Checkbox label='Соискателей от 14 лет' {...register('isForYoung')} />
          <Checkbox label='Cтудентов' {...register('isForStudents')} />
          <Checkbox
            label='Соискателей с ограниченными физ. возможностями'
            {...register('isAllowedWithDisability')}
          />
          <Checkbox label='Пенсионеров' {...register('isForPensioners')} />
          <Checkbox label='Волонтеров' {...register('isVolonteering')} />
        </div>
        <Divider className='mt-10' />
        <div className='flex justify-end gap-2'>
          <AppButton size='l'>Отмена</AppButton>
          <AppButton size='l' variant='accept' onClick={onNext}>
            Продолжить
          </AppButton>
        </div>
      </div>
    </>
  );
};

export default VacancyInfoForm;
