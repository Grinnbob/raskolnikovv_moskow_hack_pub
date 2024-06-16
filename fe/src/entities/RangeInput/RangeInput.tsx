import { Divider } from '@web/shared/ui/Divider';
import { Input, InputProps } from '@web/shared/ui/form/Input';
import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

export type RangeInputProps = Omit<InputProps, 'name' | 'type' | 'children'> & {
  fromName?: string;
  toName?: string;
  defaultMin?: string;
  defaultMax?: string;
};

export const RangeInput: FC<RangeInputProps> = ({
  fromName,
  toName,
  defaultMin,
  defaultMax,
  className,
  ...inputsProps
}) => {
  return (
    <div
      className={twMerge(
        'flex border-appGrayBorder rounded-[8px] border w-full box-content',
        className,
      )}
    >
      <Input
        name={fromName}
        type='number'
        min={0}
        classNameWrapper='border-none w-1/2'
        placeholder='от'
        defaultValue={defaultMin}
        {...inputsProps}
      />
      <Divider variant='vertical' className='my-2' />
      <Input
        name={toName}
        type='number'
        classNameWrapper='border-none w-1/2'
        placeholder='до'
        defaultValue={defaultMax}
        {...inputsProps}
      />
    </div>
  );
};
