import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

const headingsClasses = {
  1: 'text-3xl',
  2: 'text-2xl font-semibold',
  3: 'text-xl font-medium',
  4: 'text-lg font-medium',
  5: 'text-base font-medium',
};

export type HeadingProps = React.PropsWithhildren<{
  level: keyof typeof headingsClasses;
  className?: string;
}>;

export const Heading: FC<HeadingProps> = ({ level, children, className }) => {
  const Component = `h${level}` as keyof JSX.IntrinsiElements;
  return (
    <Component className={twMerge(headingsClasses[level], className)}>
      {children}
    </Component>
  );
};
