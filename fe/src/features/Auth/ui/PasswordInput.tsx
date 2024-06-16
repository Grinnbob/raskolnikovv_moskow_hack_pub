'use client';

import { useToggle } from '@web/shared/lib/hooks/useToggle';
import { Input, InputProps } from '@web/shared/ui/form/Input';
import { forwardRef } from 'react';
import { IoEyeOutline } from 'react-icons/io5';

export type PasswordInputProps = Omit<InputProps, 'type'>;

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (props, ref) => {
    const [show, toggleShow] = useToggle(false);
    return (
      <Input ref={ref} {...props} type={show ? 'text' : 'password'}>
        <IoEyeOutline
          className='cursor-pointer absolute right-4 text-strokeLight hover:text-black'
          size={20}
          onClick={toggleShow}
        />
      </Input>
    );
  },
);
