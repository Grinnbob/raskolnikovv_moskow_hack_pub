'use client';

import { Text } from '@web/shared/ui/Text';
import Link from 'next/link';
import { GoogleButton } from '@web/features/Auth/ui/GoogleButton';
import { appRoute } from '@web/shared/const/routes';
import { Input } from '@web/shared/ui/form/Input';
import { useForm } from 'react-hook-form';
import { Checkbox } from '@web/shared/ui/form/Checkbox';
import {
  IRestore,
  emailRestoreSchema,
} from '@web/shared/const/validations/signin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Roles } from '@web/shared/types/models/role.model';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { Divider } from '@web/shared/ui/Divider';
import { useBackend } from '@web/shared/lib/hooks/useBackend';
import { useRouter } from 'next/navigation';

export const RestorePasswordByEmailForm = () => {
  const router = useRouter();
  const { api } = useBackend();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IRestore>({
    resolver: zodResolver(emailRestoreSchema),
    defaultValues: { role: Roles.candidate },
  });

  const onSubmit = handleSubmit(async (data) => {
    return api
      .recoverUserPasswordByEmail(data.email, data.role)
      .then((isSuccess) => {
        if (isSuccess) {
          router.push(
            appRoute['restore-password'] + `?sentEmail=${data.email}`,
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  });

  return (
    <form className='space-y-4 mt-4' onSubmit={onSubmit}>
      <Input
        placeholder='E-mail'
        className='bg-appGray'
        error={errors.email?.message}
        {...register('email')}
      />
      <Checkbox
        label='Я ищу сотрудников'
        name='role'
        value={Roles.recruiter}
        checked={watch('role') === Roles.recruiter}
        onChange={(e: any) => {
          setValue(
            'role',
            e.target.checked ? Roles.recruiter : Roles.candidate,
          );
        }}
      />
      <AppButton
        pending={isSubmitting}
        type='submit'
        size='xl'
        className='w-full'
        variant='accept'
      >
        Продолжить
      </AppButton>
      <Divider />
      <div className='flex flex-col items-center'>
        <GoogleButton>Вход через Google</GoogleButton>
        <Text size='s' className='block text-center mt-4'>
          Нет аккаунта?{' '}
          <Link
            href={`${appRoute.signup}?prev=restore-password`}
            className='text-textBlue'
          >
            Зарегистрироваться
          </Link>
        </Text>
      </div>
    </form>
  );
};
