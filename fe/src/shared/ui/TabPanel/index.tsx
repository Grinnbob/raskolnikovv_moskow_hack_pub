import { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import { variants } from './lib/const';

export type TabProps = React.HTMLAttrbutes<HTMLLIlement> &
  (
    | {
        isActive?: boolean;
        name: React.ReactNode;
        isLink?: false;
        href?: never;
        variant?: keyof typeof variants;
      }
    | {
        isActive?: boolean;
        name: React.ReactNode;
        isLink: boolean;
        href: string;
        variant?: keyof typeof variants;
      }
  );

const Tab: FC<TabProps> = ({
  isActive,
  isLink,
  href,
  name,
  variant = 'default',
  ...rest
}) => {
  const Component = isLink ? Link : 'span';
  return (
    <li className='me-2' {...rest}>
      <Component
        href={href as string}
        className={twMerge(
          variants[variant].inactive,
          isActive && variants[variant].active,
        )}
      >
        {name}
      </Component>
    </li>
  );
};

export type TabPanelProps<T extends TabProps> = {
  tabs: Array<T>;
  activeIndex?: number;
  isActive?: (tab: T, index: number) => boolean;
  onTabClick?: (tab: T, index: number) => void;
  variant?: TabProps['variant'];
  className?: string;
};

export const TabPanel = <T extends TabProps>({
  tabs,
  onTabClick,
  activeIndex,
  isActive,
  variant,
  className,
}: TabPanelProps<T>) => {
  return (
    <ul
      className={twMerge(
        'flex flex-wrap -mb-px text-sm font-medium text-center',
        className,
      )}
    >
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          onClick={onTabClick && (() => onTabClick(tab, index))}
          isActive={activeIndex === index || isActive?.(tab, index)}
          variant={variant}
          {...tab}
        />
      ))}
    </ul>
  );
};
