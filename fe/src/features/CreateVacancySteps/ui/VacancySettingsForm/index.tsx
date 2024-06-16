'use client';

import { Divider } from '@web/shared/ui/Divider';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { FC } from 'react';
import { Heading } from '@web/shared/ui/Heading';
import { useVacancyForm } from '@web/providers/create-vacancy-form';
import { Switch } from '@web/shared/ui/form/Switch';
import { InfoPopover } from '@web/entities/Popover';
import { PseudoSelect } from '@web/entities/PseudoSelect';
import { publicationMethodsVariants } from '@web/shared/const/languageMappers';
import { Text } from '@web/shared/ui/Text';
import { TextArea } from '@web/shared/ui/form/TextArea';
import { RadioCard } from '@web/entities/RadioCard';
import styles from './styles.module.scss';

// TODO: получить тарифы с бэка
const tariffsMap = [
  {
    value: '1',
    name: 'Cтандартный',
    description: 'Какое-то описание',
    price: '1000р',
  },
  {
    value: '2',
    name: 'Cтандартный',
    description: 'Какое-то описание',
    price: '2000р',
  },
  {
    value: '3',
    name: 'Cтандартный',
    description: 'Какое-то описание',
    price: '3000р',
  },
];

export type VacancySettingsFormProps = {};

const VacancySettingsForm: FC<VacancySettingsFormProps> = () => {
  const {
    form: {
      register,
      formState: { errors },
      handleSubmit,
      control,
      getValues,
      setValue,
    },
  } = useVacancyForm();
  return (
    <>
      <div className='flex justify-between mt-5'>
        <Heading level={2}>Размещение</Heading>
      </div>
      <div className='py-4 px-5 bg-blue50 rounded-md flex justify-between items-center'>
        <Switch {...register('isMain')} label='Главная вакансия' size='l' />
        <InfoPopover>
          <div className='w-[280px]'>
            Мы будем показывать рейтинг резюме относительно этой вакансии.
            Остальные ваши вакансии будут второстепенными.
          </div>
        </InfoPopover>
      </div>
      <PseudoSelect
        label='Опубликовать вакансию'
        data={publicationMethodsVariants}
        renderOption={(item) => <Text size='s'>{item.label}</Text>}
        className='w-1/2'
        onChange={(item) => setValue('publicationMethod', item.value)}
        multiple={false}
      />
      <TextArea
        className='bg-appGray'
        label='Автоответ соискателю'
        error={errors.description?.message}
        {...register('autoreply')}
      />
      <div className='flex justify-between mt-5'>
        <Heading level={2}>Тариф</Heading>
      </div>
      <div className='flex gap-2 h-[190px]'>
        {tariffsMap.map((tariff) => {
          return (
            <RadioCard
              key={tariff.value}
              value={tariff.value}
              className='w-1/3'
              {...register('tariff')}
            >
              <div
                className={`${styles.tariff} flex flex-col justify-between h-full pb-4`}
              >
                <div>
                  <Text size='m' className='block mt-3'>
                    {tariff.name}
                  </Text>
                  <Text size='s' className='block mt-1'>
                    {tariff.description}
                  </Text>
                </div>
                <Text size='lg' className={`${styles.cost} block`}>
                  {tariff.price}
                </Text>
              </div>
            </RadioCard>
          );
        })}
      </div>
      <Divider className='mt-10' />
      <div className='flex justify-end gap-2'>
        <AppButton size='l'>Отмена</AppButton>
        <AppButton
          size='l'
          variant='accept'
          onClick={() => {
            console.log(getValues(), 'getValues()');
          }}
        >
          Продолжить
        </AppButton>
      </div>
    </>
  );
};

export default VacancySettingsForm;
