import { EAppInputType } from '@web/shared/types/enums/common';
import { forwardRef, useId } from 'react';
import { twMerge } from 'tailwind-merge';

const sizes = {
  m: {
    circle: 'h-6 w-6',
    line: 'w-10 h-4',
  },
  l: {
    circle: 'h-7 w-7',
    line: 'w-14 h-5',
  },
};

export type SwitchProps = React.HTMLAttributes<HTMLInputElement> & {
  name: string;
  group?: boolean;
  label?: string;
  value?: string;
  checked?: boolean;
  size?: keyof typeof sizes;
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  (
    {
      className,
      children,
      group,
      label,
      checked,
      onChange,
      size = 'm',
      ...checkboxProps
    },
    ref,
  ) => {
    const id = useId();
    const isContolled = Boolean(onChange);
    return (
      <label
        htmlFor={id}
        className={twMerge(
          'flex items-center cursor-pointer select-none text-textLight [&:has(input:checked)]:text-textBlue',
          className,
        )}
      >
        <div className='relative'>
          <input
            id={id}
            type='checkbox'
            className='peer sr-only'
            key={isContolled ? id : `${id}_${checked}`}
            defaultChecked={checked && !isContolled ? true : undefined}
            data-app-type={
              group
                ? EAppInputType.MULTI_CHECKBOX
                : EAppInputType.SINGLE_CHECKBOX
            }
            onChange={onChange}
            ref={ref}
            {...checkboxProps}
          />
          <div
            className={twMerge(
              sizes[size].line,
              'rounded-full shadow-inner bg-gray-3 bg-strokeLight peer-checked:bg-infoBg',
            )}
          ></div>
          <div
            className={twMerge(
              sizes[size].circle,
              'absolute left-0 transition bg-textLight rounded-full dot shadow-switch-1 dark:bg-dark-4 -top-1 peer-checked:translate-x-full peer-checked:bg-textBlue',
            )}
          ></div>
        </div>
        {label && <span className='ms-3 text-sm font-medium'>{label}</span>}
        {children}
      </label>
    );
  },
);
