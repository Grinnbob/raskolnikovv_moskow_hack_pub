'use client';

import { useRouter } from 'next/navigation';
import { FC, useEffect, useState } from 'react';
import { signIn } from 'next-auth/react';
import toast from 'react-hot-toast';
import { DEFAULT_ERROR_TEXT } from '@web/shared/const/config';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ILogin,
  ISignUp,
  loginSchema,
  signupSchema,
} from '@web/shared/const/validations/signin';
import { Text } from '@web/shared/ui/Text';
import { Input } from '@web/shared/ui/form/Input';
import Link from 'next/link';
import { Divider } from '@web/shared/ui/Divider';
import { EAuthErrorType } from '@web/shared/types/enums/auth';
import { appRoute } from '@web/shared/const/routes';
import { Roles } from '@web/shared/types/models/role.model';
import { Checkbox } from '@web/shared/ui/form/Checkbox';
import { PasswordInput } from '@web/features/Auth/ui/PasswordInput';

const knownErrorsMap: Partial<Record<EAuthErrorType, string>> = {
  [EAuthErrorType.WRONG_CREDENTIALS]: 'Неверный логин или пароль',
};

export type CredentialsFormProps = {
  variant: 'signin' | 'signup';
  children?: React.ReactNode;
};

export const CredentialsForm: FC<CredentialsFormProps> = ({
  children,
  variant,
}) => {
  const isSignIn = variant === 'signin';
  const isSignUp = variant === 'signup';
  const {
    register,
    formState: { errors, isSubmitting },
    handleSubmit,
    watch,
    setValue,
    getValues,
  } = useForm<ISignUp | ILogin>({
    resolver: zodResolver(isSignIn ? loginSchema : signupSchema),
    defaultValues: { role: Roles.candidate },
  });
  const [apiError, setApiError] = useState<string>();
  const router = useRouter();

  const onSubmit = handleSubmit(async (data) => {
    const res = await signIn('credentials', {
      ...data,
      isNew: isSignUp,
      redirect: false,
    });

    if (!res?.ok) {
      const error = res?.error || DEFAULT_ERROR_TEXT;

      if (error in EAuthErrorType) {
        if (error === EAuthErrorType.ALREADY_EXIST) {
          return router.push(
            `${appRoute.signin}?prev=signup&error=Пользователь с email: ${getValues('email')} и ролью ${getValues('role')} уже существует. Авторизируйтесь.`,
          );
        }

        return setApiError(knownErrorsMap[error as EAuthErrorType]);
      }

      toast.error(error);
    } else {
      router.push(appRoute[isSignUp ? 'confirm-email' : 'main']);
    }
  });

  useEffect(() => {
    if (apiError) {
      const subscription = watch((_, { name }) => {
        if (name === 'password' || name === 'email') {
          setApiError(undefined);
        }
      });
      return () => subscription.unsubscribe();
    }
  }, [apiError, watch]);

  const credInputClass = !apiError ? 'bg-appGray' : 'bg-addRed';

  return (
    <form className='space-y-4 mt-4' onSubmit={onSubmit}>
      <Input
        placeholder='E-mail'
        className={credInputClass}
        error={errors.email?.message}
        {...register('email')}
      />
      <PasswordInput
        placeholder='Пароль'
        className={credInputClass}
        error={errors.password?.message}
        {...register('password')}
      />
      {isSignUp && (
        <PasswordInput
          placeholder='Пароль'
          className={credInputClass}
          //@ts-ignore
          error={errors.passwordConfirm?.message}
          {...register('passwordConfirm')}
        />
      )}
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
      {apiError && (
        <Text className='text-mainRed' size='s'>
          {apiError}
        </Text>
      )}
      {isSignIn && (
        <Link
          href={`${appRoute['restore-password']}?prev=signin`}
          className='block'
        >
          <Text color='blue' size='s'>
            Не помню пароль
          </Text>
        </Link>
      )}
      <AppButton
        pending={isSubmitting}
        type='submit'
        size='xl'
        className='w-full'
        variant='accept'
      >
        {isSignIn ? 'Войти' : 'Зарегистрироваться'}
      </AppButton>
      <Text size='xs' color='light' className='text-center block'>
        Нажимая «Войти», вы соглашаетесь{' '}
        <Link className='text-textBlue' href='/policy'>
          с политикой конфиденциальности и условиями обработки персональных
          данных
        </Link>
      </Text>
      {children && (
        <>
          <Divider />
          {children}
        </>
      )}
    </form>
  );
};
