import { Heading } from '@web/shared/ui/Heading';
import { Text } from '@web/shared/ui/Text';
import { QueryPrevLink } from '@web/entities/QueryPrevLink';
import { AppRoute } from '@web/shared/const/routes';
import { FaTelegram } from 'react-icons/fa';
import { RestorePasswordByEmailForm } from '@web/features/Auth/ui/RestorePasswordByEmailForm';

const RestorePasswordPage = ({
  searchParams = {},
}: {
  searchParams: { prev?: AppRoute; sentEmail?: string };
}) => {
  return (
    <>
      <div className='flex justify-center items-center h-full'>
        <div className='bg-white py-10 px-4 shadow-xl rounded-2xl w-[24px]'>
          {searchParams.sentEmail ? (
            <div className='flex flex-col items-center text-center'>
              <FaTelegram
                size={56}
                className='text-addBlue bg-black rounded-full overflow-hidden border-none'
              />
              <Heading level={1} className='my-2'>
                Почти готово!
              </Heading>
              <Text size='s'>
                Мы выслали ссылку для сброса пароля на почту{' '}
                {searchParams.sentEmail}. Перейдите по ней и придумайте новый
              </Text>
            </div>
          ) : (
            <>
              <QueryPrevLink route={searchParams.prev} />
              <Heading level={1} className='mb-2'>
                Сбросить пароль?
              </Heading>
              <Text size='s'>
                Укажите почту, к которой привязан ваш аккаунт, мы вышлем
                временный пароль
              </Text>
              <RestorePasswordByEmailForm />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RestorePasswordPage;
