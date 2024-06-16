import { EAppInputType } from '@web/shared/types/enums/common';
import React, { forwardRef, useId } from 'react';
import { twMerge } from 'tailwind-merge';

export type CheckboxProps = React.HTMLAttributes<HTMLInputElement> & {
  name: string;
  group?: boolean;
  label?: string;
  value?: string;
  checked?: boolean;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, children, group, label, checked, onChange, ...checkboxProps },
    ref,
  ) => {
    const id = useId();
    const isContolled = Boolean(onChange);
    return (
      <div className={twMerge('flex items-center', className)}>
        <input
          id={id}
          key={isContolled ? id : `${id}_${checked}`}
          type='checkbox'
          className='w-4 h-4 text-textBlue bg-gray-100 border-gray-300 rounded focus:ring-2'
          defaultChecked={checked && !isContolled ? true : undefined}
          data-app-type={
            group ? EAppInputType.MULTI_CHECKBOX : EAppInputType.SINGLE_CHECKBOX
          }
          onChange={onChange}
          {...checkboxProps}
          ref={ref}
        />
        {label && (
          <label
            htmlFor={id}
            className='ms-2 text-sm font-medium text-gray-900'
          >
            {label}
          </label>
        )}
        {children}
      </div>
    );
  },
);
