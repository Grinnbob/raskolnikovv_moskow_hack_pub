import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

const classes = {
  vertical:
    'inline-block h-100 min-h-[1em] w-[1px] self-stretch bg-strokeLight opacity-100 mx-2',
  horizontal: 'my-1 h-[1px] border-t-0 bg-strokeLight opacity-100',
};

export type DividerProps = React.HTMLAtributes<HTMLDivElment> & {
  variant?: keyof typeof classes;
};

export const Divider: FC<DividerProps> = ({
  variant = 'horizontal',
  className,
  ...props
}) => {
  const Component = variant === 'horizontal' ? 'hr' : 'div';

  return (
    <Component {...props} className={twMerge(classes[variant], className)} />
  );
};
