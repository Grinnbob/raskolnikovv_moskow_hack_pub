import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

const textsClasses = {
  xs: 'text-xs font-normal',
  s: 'text-sm font-normal',
  m: 'text-base font-medium',
  lg: 'text-lg font-medium',
  xl: 'text-xl font-medium',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
  '7xl': 'text-7xl',
};

const textColors = {
  primary: 'text-gray-900',
  secondary: 'text-textGray',
  light: 'text-textLight',
  red: 'text-textRed',
  blue: 'text-textBlue',
};

export type TextProps = React.PropsWithChildren<{
  size?: keyof typeof textsClasses;
  color?: keyof typeof textColors;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}>;

export const Text: FC<TextProps> = ({
  size = 'm',
  color = 'primary',
  children,
  className,
  as: AsComp,
}) => {
  const Component = AsComp || 'span';
  return (
    <Component
      className={twMerge(textsClasses[size], textColors[color], className)}
    >
      {children}
    </Component>
  );
};
