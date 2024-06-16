import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { ButtonSpinner } from './ui/ButtonSpinner';

const classes = {
  outline:
    'text-primary hover:text-white disabled:text-white border border-primary enabled:hover:bg-primaryDark disabled:bg-primaryDark focus:outline-none font-medium rounded-[64px] text-sm text-center inline-flex items-center',
  primary:
    'text-black bg-primary disabled:bg-primaryDark enabled:hover:bg-addBlue focus:outline-none font-medium rounded-[64px] text-sm text-center inline-flex items-center',
  accept:
    'text-white bg-mainRed disabled:bg-primaryDark enabled:hover:bg-mainRedDark focus:outline-none font-medium rounded-[64px] text-sm text-center inline-flex items-center',
  add: 'text-black bg-addRed disabled:bg-primaryDark enabled:hover:bg-addRedDark focus:outline-none font-medium rounded-[64px] text-sm text-center inline-flex items-center',
  cancel:
    'text-textGray bg-white disabled:bg-primaryDark enabled:hover:bg-addRedDark enabled:hover:text-white focus:outline-none font-medium rounded-[64px] text-sm text-center inline-flex items-center',
  addBlue:
    'text-textBlue bg-addBlue focus:outline-none font-medium rounded-[56px] text-sm text-center inline-flex items-center',
};

const sizes = {
  m: 'px-[16px] py-[3px]',
  md: 'px-[12px] py-[8px]',
  l: 'px-[16px] py-[12px]',
  xl: 'px-[40px] py-[12px]',
};

export type AppButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: JSX.Element;
  iconEnd?: JSX.Element;
  pending?: boolean;
  variant?: keyof typeof classes;
  size?: keyof typeof sizes;
  full?: boolean;
};

export const AppButton: FC<AppButtonProps> = ({
  children,
  icon,
  className,
  pending,
  variant = 'primary',
  size = 'm',
  iconEnd,
  full,
  ...rest
}) => {
  return (
    <button
      type='button'
      className={twMerge(
        classes[variant],
        sizes[size],
        'justify-center gap-[8px] transition-colors duration-200',
        full && 'w-full',
        className,
      )}
      disabled={pending}
      {...rest}
    >
      {pending ? <ButtonSpinner /> : icon}
      {children}
      {iconEnd}
    </button>
  );
};
