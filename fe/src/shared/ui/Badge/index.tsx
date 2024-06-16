import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

const classes = {
  default: 'bg-appGray text-textBlue py-[2px] px-[8px]',
  bare: 'bg-white text-textLight py-[2px] px-[8px]',
  transparent: 'bg-transparent text-textLight',
  inverse: 'bg-black text-white py-[2px] px-[8px]',
};

const sizes = {
  m: 'text-sm font-normal',
};

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  text?: string;
  icon?: JSX.Element;
  iconEnd?: JSX.Element;
  variant?: keyof typeof classes;
  size?: keyof typeof sizes;
};

export const Badge: FC<BadgeProps> = ({
  text,
  className,
  variant = 'default',
  icon,
  iconEnd,
  size = 'm',
  ...props
}) => {
  if (!text) return null;
  return (
    <span
      className={twMerge(
        classes[variant],
        sizes[size],
        'rounded-[8px] inline-flex items-center gap-2',
        className,
      )}
      {...props}
    >
      {icon}
      {text}
      {iconEnd}
    </span>
  );
};
