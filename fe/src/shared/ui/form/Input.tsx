import { forwardRef, useId } from 'react';
import { twMerge } from 'tailwind-merge';

export type InputProps = React.HTMLAttributes<HTMLInputElement> & {
  label?: string;
  name?: string;
  type?: string;
  classNameWrapper?: string;
  error?: string;
  children?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { label, className, classNameWrapper, error, children, ...inputProps },
    ref,
  ) => {
    const id = useId();
    return (
      <div className={twMerge('w-full', classNameWrapper)}>
        {label && (
          <label
            htmlFor={id}
            className='block text-sm font-medium text-gray-900 mb-2'
          >
            {label}
          </label>
        )}
        <div className='flex gap-4 items-center relative'>
          <input
            id={id}
            type='text'
            className={twMerge(
              'bg-white border-appGrayBorder rounded-lg border text-gray-900 disabled:text-textGray text-sm rounded-lglock w-full p-2.5 focus:border-appLightBlue focus:outline-none focus:ring-0',
              className,
              error && 'border-mainRed focus:border-border-mainRed',
            )}
            onChange={inputProps.onChange}
            ref={ref}
            {...inputProps}
          />
          {children}
        </div>
        {error && <span className='text-mainRed text-sm'>{error}</span>}
      </div>
    );
  },
);
