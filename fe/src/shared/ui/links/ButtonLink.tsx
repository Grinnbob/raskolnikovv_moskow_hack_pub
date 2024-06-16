import * as React from 'react';
import { cn } from '@web/shared/lib/utils';
import UnstyledLink, { UnstyledLinkProps } from './UnstyledLink';

const ButtonLinkVariant = ['light', 'dark'] as const;
const ButtonLinkSize = ['sm', 'base'] as const;

type ButtonLinkProps = {
  variant?: (typeof ButtonLinkVariant)[number];
  size?: (typeof ButtonLinkSize)[number];
} & UnstyledLinkProps;

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    { children, className, variant = 'primary', size = 'base', ...rest },
    ref,
  ) => {
    return (
      <UnstyledLink
        ref={ref}
        {...rest}
        className={cn(
          'inline-flex items-center rounded font-medium',
          'focus-visible:ring-primary-500 focus:outline-none focus-visible:ring',
          'shadow-sm',
          'transition-colors duration-75',
          [
            size === 'base' && ['px-3 py-1.5', 'text-sm md:text-base'],
            size === 'sm' && ['px-2 py-1', 'text-xs md:text-sm'],
          ],
          [
            variant === 'light' && [
              'bg-white text-gray-700',
              'border border-gray-900',
              'hover:text-white hover:bg-gray-900',
              'active:active:bg-gray-700 disabled:bg-gray-200',
            ],
            variant === 'dark' && [
              'bg-gray-900 text-white',
              'border border-gray-600',
              'hover:bg-white hover:text-gray-900 active:bg-gray-100 disabled:bg-gray-700',
            ],
          ],
          'disabled:cursor-not-allowed',
          className,
        )}
      >
        {children}
      </UnstyledLink>
    );
  },
);

export default ButtonLink;
