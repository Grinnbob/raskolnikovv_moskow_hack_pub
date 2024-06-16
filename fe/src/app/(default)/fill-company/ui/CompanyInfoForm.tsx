'use client';

import { twMerge } from 'tailwind-merge';
import styles from '../styles.module.scss';
import { Switch } from '@web/shared/ui/form/Switch';
import { Input } from '@web/shared/ui/form/Input';
import { TextArea } from '@web/shared/ui/form/TextArea';
import { Divider } from '@web/shared/ui/Divider';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { UploadLogo } from './UploadLogo';
import { useForm } from 'react-hook-form';
import { ICompany, companySchema } from '@web/shared/const/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { companySizeMap } from '@web/shared/const/languageMappers';
import { PseudoSelect } from '@web/entities/PseudoSelect';
import { Text } from '@web/shared/ui/Text';
import { IndustryModel } from '@web/shared/types/models/industry.model';
import { FC } from 'react';
import { MultichoiceChips } from '@web/entities/PseudoSelect/MultichoiceChips';
import { Heading } from '@web/shared/ui/Heading';
import { useHookFormMask } from 'use-mask-input';
import { useBackend } from '@web/shared/lib/hooks/useBackend';
import { RiVerifiedBadgeFill } from 'react-icons/ri';
import { InfoBlock } from '@web/shared/ui/InfoBlock';

export type CompanyInfoFormProps = {
  industries: IndustryModel[];
};

const CompanyInfoForm: FC<CompanyInfoFormProps> = ({ industries }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<ICompany>({
    resolver: zodResolver(companySchema),
  });
  const maskedRegister = useHookFormMask(register);
  const { api, pending } = useBackend({ trackState: true });

  const onSubmit = handleSubmit(async (data) => {
    // TODO - если 1 компания = 1 аккаунт то взять companyId из авторизации
    // Юзер не должен иметь возможность кинуть запрос на редактирование чужой компании
    await api.upsertCompany(data);
    // TODO - редирект к созданию вакансии / либо в лк если пришел по кнопке
  });

  return (
    <form className={twMerge(`w-full`, styles.layout)} onSubmit={onSubmit}>
      <div className='grow-1 z-10 bg-white flex flex-col gap-6 border border-strokeLight rounded-[16px] p-8 relative mt-12'>
        <UploadLogo setValue={setValue} api={api} />
        <div className='flex justify-between mt-5'>
          <Heading level={2}>Основное</Heading>
          <Switch label='Стартап' {...register('isStartup')} />
        </div>
        <div className='flex flex-col gap-4'>
          <Input
            placeholder='Введите реальное название'
            className='bg-appGray'
            label='Название'
            error={errors.name?.message}
            {...register('name')}
          />
          <TextArea
            className='bg-appGray'
            placeholder='Расскажите о компании, достижениях, чем занимаетесь,
Избегайте длинных формулировок, чтобы не утомить'
            label='Описание'
            error={errors.description?.message}
            {...register('description')}
          />
          <Input
            placeholder='Введите адрес'
            className='bg-appGray'
            label='Адрес'
            error={errors.address?.message}
            {...register('address')}
          />
          <div className='flex gap-4 w-full justify-between'>
            <Input
              placeholder='Например Например, site.ru'
              className='bg-appGray'
              classNameWrapper='w-1/2'
              label='Сайт'
              error={errors.website?.message}
              {...register('website')}
            />
            <PseudoSelect
              label='Размер компании'
              data={companySizeMap}
              renderOption={(item) => <Text size='s'>{item.label}</Text>}
              onChange={(item) => setValue('companySize', item.value)}
              multiple={false}
              className='w-1/2'
              error={errors.companySize?.message}
            />
          </div>
          <MultichoiceChips
            label='Отрасль компании'
            className='w-1/2'
            data={industries}
            onChange={(items) => setValue('industries', items)}
            error={errors.industries?.message}
          />
          <Divider className='mt-10' />
          <div className='flex justify-end gap-2'>
            <AppButton size='l'>Отмена</AppButton>
            <AppButton
              size='l'
              type='submit'
              variant='accept'
              pending={pending.upsertCompany}
            >
              Продолжить
            </AppButton>
          </div>
        </div>
      </div>
      <aside className='bg-white flex flex-col gap-6 mt-12'>
        <InfoBlock
          className='rounded-2xl p-5 flex flex-col gap-3'
          variant='blue'
          badgeIcon={
            <RiVerifiedBadgeFill
              size='36px'
              className='text-appIconBlue box-content'
            />
          }
        >
          <Heading level={4} className='text-textBlue text-left'>
            Верификация компании
          </Heading>
          <Text size='s' color='blue'>
            Отметка «Проверенная компания» увеличивает доверие соискателей и
            число откликов
          </Text>
          <Input
            placeholder='Введите ИНН'
            label='ИНН'
            {...maskedRegister('INN', '999 999 9999')}
            error={errors.INN?.message}
          />
          <Input
            placeholder='Введите КПП'
            label='КПП'
            {...maskedRegister('KPP', '999 999 999')}
            error={errors.KPP?.message}
          />
          <Input
            placeholder='Введите ОГРН'
            label='ОГРН'
            {...maskedRegister('OGRN', '9999 9999 99999')}
            error={errors.OGRN?.message}
          />
        </InfoBlock>
        <Text size='s' className='text-center' color='light'>
          Реквизиты не будут видны для соискателей, они нужны для подтверждения
          компании.
        </Text>
      </aside>
    </form>
  );
};

export default CompanyInfoForm;
