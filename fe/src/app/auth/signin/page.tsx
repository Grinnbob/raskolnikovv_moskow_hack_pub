import { Heading } from '@web/shared/ui/Heading';
import { Text } from '@web/shared/ui/Text';
import Link from 'next/link';
import { CredentialsForm } from '@web/features/Auth/ui/CredentialsForm';
import { GoogleButton } from '@web/features/Auth/ui/GoogleButton';
import { QueryPrevLink } from '@web/entities/QueryPrevLink';
import { AppRoute, appRoute } from '@web/shared/const/routes';

const SignInPage = ({
  searchParams = {},
}: {
  searchParams: { prev?: AppRoute };
}) => {
  return (
    <>
      <div className='flex justify-center items-center h-full'>
        <div className='bg-white py-1 px-4 shadow-xl rounded-2xl w-[24px]'>
          <QueryPrevLink route={searchParams.prev} />
          <Heading level={1} className='mb-2'>
            Вход
          </Heading>
          <Text size='s'>
            Добро пожаловать в Raskolnikovv. Введите свои данные, чтобы войти
          </Text>
          <CredentialsForm variant='signin'>
            <div className='flex flex-col items-center'>
              <GoogleButton>Вход через Google</GoogleButton>
              <Text size='s' className='block text-center mt-4'>
                Нет аккаунта?{' '}
                <Link
                  href={`${appRoute.signup}?prev=signin`}
                  className='text-textBlue'
                >
                  Зарегистрироваться
                </Link>
              </Text>
            </div>
          </CredentialsForm>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
