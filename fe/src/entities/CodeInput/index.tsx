'use client';

import { Text } from '@web/shared/ui/Text';
import { FC, useCallback, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

export type CodeInputProps = {
  length: number;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
};

export const CodeInput: FC<CodeInputProps> = ({
  length,
  onChange,
  error,
  className,
  disabled,
  defaultValue,
}) => {
  const inputClass = !error ? 'bg-appGray' : 'bg-addRed';

  const jsx = useMemo(() => {
    const _jsx: JSX.Element[] = [];

    for (let i = 0; i < length; i++) {
      _jsx.push(
        <input
          name='code'
          data-index={String(i)}
          type='text'
          maxLength={1}
          defaultValue={defaultValue?.[i]}
          className={twMerge(
            inputClass,
            'block w-11 h-11 text-center rounded-lg border-none',
          )}
          disabled={disabled}
          required
        />,
      );
    }
    return _jsx;
  }, [length, inputClass, disabled]);

  const _onKeyUp = useCallback(
    (event: React.KeyboardEvent<HTMLFormElement>) => {
      const elements = event.currentTarget.elements;
      const target = event.target as HTMLInputElement;
      const index = target.dataset?.index && Number(target.dataset?.index);

      if (typeof index !== 'number') return;

      if (target.value.length === 0) {
        (elements?.[index - 1] as HTMLInputElement)?.focus();
      } else {
        (elements?.[index + 1] as HTMLInputElement)?.focus();
      }
    },
    [],
  );

  return (
    <form
      className={twMerge(
        'max-w-sm mx-auto flex justify-center flex-col items-center',
        className,
      )}
      onChange={(event) => {
        const elements = event.currentTarget.elements.namedItem('code');
        onChange?.(
          Array.from(elements as RadioNodeList)
            //@ts-ignore
            .map<HTMLInputElement[]>((item) => item.value)
            .join(''),
        );
      }}
      onKeyUp={_onKeyUp}
    >
      <div className='flex mb-2 space-x-2 rtl:space-x-reverse'>
        {jsx}
      </div>
      {error && <Text className='text-mainRed text-sm'>{error}</Text>}
    </form>
  );
};
