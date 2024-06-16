import React, { forwardRef, useId } from 'react';
import { twMerge } from 'tailwind-merge';

export type RadioProps = React.HTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  value: string;
  noWrap?: boolean;
  checked?: boolean;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      className,
      children,
      label,
      id,
      noWrap,
      onChange,
      checked,
      ...radioProps
    },
    ref,
  ) => {
    const _id = useId();
    const rId = id || _id;
    const Wrapper = noWrap ? React.Fragment : 'div';
    const isContolled = Boolean(onChange);
    return (
      <Wrapper className={twMerge('flex items-center', className)}>
        <input
          key={isContolled ? rId : `${rId}_${checked}`}
          ref={ref}
          id={rId}
          type='radio'
          className='w-4 h-4 text-textBlue bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2'
          onChange={onChange}
          checked={checked}
          {...radioProps}
        />
        {label && (
          <label
            htmlFor={rId}
            className='ms-2 text-sm font-medium text-gray-900'
          >
            {label}
          </label>
        )}
        {children}
      </Wrapper>
    );
  },
);
