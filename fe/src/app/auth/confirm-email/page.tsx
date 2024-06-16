'use client';

import { VerifyCode } from '@web/features/Auth/ui/VerifyCode';
import { Heading } from '@web/shared/ui/Heading';
import { Text } from '@web/shared/ui/Text';
import { useSession } from 'next-auth/react';

const ConfirmEmailPage = ({
  searchParams = {},
}: {
  searchParams: { code?: string };
}) => {
  const session = useSession();
  return (
    <>
      <div className='flex justify-center items-center h-full'>
        <div className='bg-white py-10 px-14 shadow-xl rounded-2xl w-[424px]'>
          <Heading level={1} className='mb-2'>
            Подтвердите почту
          </Heading>
          <Text size='s'>
            Выслали код на почту {session.data?.apiUser.email}
          </Text>
          <VerifyCode variant='email' defaultCode={searchParams.code} />
        </div>
      </div>
    </>
  );
};

export default ConfirmEmailPage;
