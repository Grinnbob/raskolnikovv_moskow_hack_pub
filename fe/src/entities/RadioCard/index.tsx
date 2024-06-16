import { Radio } from '@web/shared/ui/form/Radio';
import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

export type RadioCardProps = React.HTMLAttributes<HTMLInputElement> & {
  name: string;
  value: string;
  children: React.ReactNode;
};

export const RadioCard = forwardRef<HTMLInputElement, RadioCardProps>(
  ({ className, children, value, ...radioProps }, ref) => {
    return (
      <label
        key={value}
        className={twMerge(
          'p-4 rounded-lg border border-strokeLight h-full [&:has(input:checked)]:border-appIconBlue cursor-pointer',
          className,
        )}
      >
        <Radio
          value={value}
          {...radioProps}
          ref={ref}
          className='mb-4'
          noWrap
        />
        {children}
      </label>
    );
  },
);
