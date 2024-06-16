'use client';

import { CodeInput } from '@web/entities/CodeInput';
import { appRoute } from '@web/shared/const/routes';
import { useBackend } from '@web/shared/lib/hooks/useBackend';
import { Loader } from '@web/shared/ui/Loader';
import { addMinutes } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import { z } from 'zod';

const CODE_LENGTH = 5;
const validate = z.string().min(CODE_LENGTH);

const codeErrorsMap: Record<number, string> = {
  410: 'Срок действия кода истек.',
  409: 'Неверный код',
};

export type VerifyCodeProps = {
  variant: 'email' | 'phone';
  defaultCode?: string;
};

export const VerifyCode = ({ defaultCode }: VerifyCodeProps) => {
  const router = useRouter();
  const { api, status, pending } = useBackend({
    trackState: true,
    silent: ['checkEmailValidationCode'],
    requiredSession: true,
  });
  const [error, setError] = useState('');
  const [resendCodeAt, setResendCodeAt] = useState<Date | null>(null);

  const onChange = (str: string) => {
    error && setError('');
    if (validate.safeParse(str).success) {
      api
        .checkEmailValidationCode(str)
        .then((data) => {
          data.success && router.push(appRoute.main);
        })
        .catch((e: any) => {
          if (
            e?.response?.status &&
            codeErrorsMap[e.response.status as number]
          ) {
            setError(codeErrorsMap[e.response.status]);
          }
        });
    }
  };

  const resendCode = () => {
    api.sendEmailValidationCode().then((newSent) => {
      setResendCodeAt(addMinutes(newSent.emailValidationCodeSentAt, 1));
    });
  };

  useEffect(() => {
    if (status === 'authenticated') {
      api.getMe().then((data) => {
        if (data.emailValidationCodeSentAt) {
          setResendCodeAt(addMinutes(data.emailValidationCodeSentAt, 1));
        } else {
          resendCode();
        }
      });
      defaultCode && onChange(defaultCode);
    }
  }, [defaultCode, status]);

  return (
    <>
      <CodeInput
        className='mt-4'
        length={CODE_LENGTH}
        onChange={onChange}
        error={error}
        defaultValue={defaultCode}
      />
      {!resendCodeAt || pending.sendEmailValidationCode ? (
        <Loader className='text-center' />
      ) : (
        <Countdown
          date={resendCodeAt}
          zeroPadTime={2}
          key={resendCodeAt.getTime()}
          renderer={({ seconds, minutes }) => {
            return (
              <div
                onClick={!seconds ? resendCode : undefined}
                className='text-textGray cursor-pointer text-sm text-center mt-2'
              >
                {seconds ? (
                  <>
                    Получить код повторно{' '}
                    <span className='font-medium'>
                      Через {minutes}:{seconds}
                    </span>
                  </>
                ) : (
                  'Отправить заново'
                )}
              </div>
            );
          }}
        />
      )}
    </>
  );
};
