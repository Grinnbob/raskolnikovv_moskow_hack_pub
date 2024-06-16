'use client';

import { Input } from '@web/shared/ui/form/Input';
import { Divider } from '@web/shared/ui/Divider';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { FC } from 'react';
import { Heading } from '@web/shared/ui/Heading';
import { useVacancyForm } from '@web/providers/create-vacancy-form';
import { useHookFormMask } from 'use-mask-input';
import { GoPlus } from 'react-icons/go';
import { InputArray } from '@web/entities/InputArray';
import { PiTelegramLogo } from 'react-icons/pi';
import { SlSocialVkontakte } from 'react-icons/sl';
import { FiFacebook } from 'react-icons/fi';
import { CiLinkedin } from 'react-icons/ci';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { IContacts, contactsSchema } from '@web/shared/const/validations';
import { RxCross1 } from 'react-icons/rx';
import { Text } from '@web/shared/ui/Text';
import {
  SocialInput,
  socialInputs,
  useDefaultContactValues,
} from './lib/useDefaultContactValues';

export type VacancyContactFormProps = {};

const VacancyContactForm: FC<VacancyContactFormProps> = () => {
  const { api, session, form, onNext, hasCurrentStepErrors, contacts } =
    useVacancyForm();

  const selectedContactId = form.getValues().contactId;
  const { defaultValues, selectedContact } = useDefaultContactValues(
    contacts,
    selectedContactId,
  );

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<IContacts & { emails: object[]; phones: object[] }>({
    resolver: zodResolver(contactsSchema),
    defaultValues,
    disabled: Boolean(selectedContact),
  });

  const maskedRegister = useHookFormMask(register);
  const onNextOrAddContact = handleSubmit(
    (data) => {
      api
        //@ts-ignore
        .upsertContacts({
          ...data,
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          userId: session?.apiUser.id!,
        })
        .then((newContact) => {
          form.setValue('contactId', newContact.id!);
          onNext();
        });
    },
    () => {
      if (selectedContactId) {
        onNext();
      }
    },
  );

  return (
    <>
      {hasCurrentStepErrors && (
        <Text className='text-mainRed text-sm'>
          Необходимо выбрать контакт из списка или ввести новые данные
        </Text>
      )}
      <div className='flex justify-between mt-5'>
        <Heading level={2}>Контакты</Heading>
      </div>
      <InputArray
        name='phones'
        label='Телефон'
        addButtonText='Телефон'
        control={control}
        maxLength={2}
        renderInput={(index, field) => {
          const fieldName = index ? 'secondPhone' : 'phone';
          return (
            <Input
              defaultValue={field.value}
              className='bg-appGray'
              classNameWrapper='w-max'
              error={errors[fieldName]?.message}
              {...maskedRegister(
                index ? 'secondPhone' : 'phone',
                '+9 (999) 999-99-99',
              )}
            />
          );
        }}
      />
      <InputArray
        name='emails'
        label='Email'
        addButtonText='Email'
        control={control}
        maxLength={2}
        renderInput={(index, field) => {
          const fieldName = index ? 'secondEmail' : 'email';
          return (
            <Input
              defaultValue={field.value}
              className='bg-appGray'
              classNameWrapper='w-max'
              error={errors[fieldName]?.message}
              placeholder='user@mail.ru'
              {...register(fieldName)}
            />
          );
        }}
      />
      <Heading level={2}>Мессенджеры и соцсети</Heading>
      <InputArray
        name='socials'
        control={control}
        noAdd
        noRemove
        //@ts-ignore
        renderInput={(index, field: SocialInput, methods) => {
          const disabled = control._formState.disabled;
          return (
            <Input
              defaultValue={field.value}
              label={field.label}
              className='bg-appGray'
              classNameWrapper='w-max'
              error={errors[field.name]?.message}
              placeholder={field.placeholder}
              {...maskedRegister(field.name, field.mask)}
            >
              {!disabled && (
                <RxCross1
                  size={16}
                  className='cursor-pointer text-textLight'
                  onClick={() => methods.remove(index)}
                />
              )}
            </Input>
          );
        }}
      >
        {({ append, fields }) => {
          const hasButtons = fields.reduce<Record<string, boolean>>(
            (acc, field) => {
              if ('name' in field && typeof field.name === 'string') {
                acc[field.name] = true;
              }
              return acc;
            },
            {},
          );
          return (
            <div>
              {!hasButtons.telegram && (
                <AppButton
                  variant='outline'
                  className='text-textBlue text-sm mt-2'
                  icon={<GoPlus size={18} />}
                  onClick={() => append(socialInputs.telegram)}
                >
                  <PiTelegramLogo size={24} />
                </AppButton>
              )}
              {!hasButtons.vk && (
                <AppButton
                  variant='outline'
                  className='text-textBlue text-sm mt-2'
                  icon={<GoPlus size={18} />}
                  onClick={() => append(socialInputs.vk)}
                >
                  <SlSocialVkontakte size={24} />
                </AppButton>
              )}
              {!hasButtons.facebook && (
                <AppButton
                  variant='outline'
                  className='text-textBlue text-sm mt-2'
                  icon={<GoPlus size={18} />}
                  onClick={() => append(socialInputs.facebook)}
                >
                  <FiFacebook size={24} />
                </AppButton>
              )}
              {!hasButtons.linkedin && (
                <AppButton
                  variant='outline'
                  className='text-textBlue text-sm mt-2'
                  icon={<GoPlus size={18} />}
                  onClick={() => append(socialInputs.linkedin)}
                >
                  <CiLinkedin size={24} />
                </AppButton>
              )}
            </div>
          );
        }}
      </InputArray>
      <Input
        label='Дополнительно'
        className='bg-appGray'
        error={errors.other?.message}
        placeholder='ulala.com'
        {...register('other')}
      />
      <Divider className='mt-10' />
      <div className='flex justify-end gap-2'>
        <AppButton size='l'>Отмена</AppButton>
        <AppButton size='l' variant='accept' onClick={onNextOrAddContact}>
          Продолжить
        </AppButton>
      </div>
    </>
  );
};

export default VacancyContactForm;
