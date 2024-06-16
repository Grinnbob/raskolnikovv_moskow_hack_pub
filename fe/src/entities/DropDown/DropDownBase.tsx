'use client';

import { AppButton, AppButtonProps } from '@web/shared/ui/buttons/AppButton';
import { useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styles from './styles.module.scss';
import { useClickOutside } from '@web/shared/lib/hooks/useClickOutside';
import { Text } from '@web/shared/ui/Text';

export type DropDownBaseProps<T> = AppButtonProps & {
  classNameBtn?: string;
  text: string;
  content?: T;
  renderContent?: (isOpen: boolean, content?: T) => React.ReactNode;
  onToggle?: (isOpen: boolean, content?: T) => void;
  children?: React.ReactNode;
  label?: string;
};

export const shevron = (
  <MdKeyboardArrowDown size={23} className={styles.shevron} />
);

export const DropDownBase = <T,>({
  className,
  classNameBtn,
  text,
  children,
  content,
  renderContent,
  onToggle,
  label,
  ...btnProps
}: DropDownBaseProps<T>) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));
  return (
    <div className={twMerge('relative', className)}>
      {label && <Text>{label}</Text>}
      <AppButton
        onClick={() => {
          setOpen(!open);
          onToggle?.(!open);
        }}
        iconEnd={shevron}
        className={twMerge(
          'transition-all',
          classNameBtn,
          open && styles.rotateChild,
        )}
        {...btnProps}
      >
        {text}
      </AppButton>
      <div
        className={twMerge(
          'bg-white divide-y divide-gray-100 rounded-[8px] w-max max-w-full absolute p-[16px] box-content table',
          styles.content,
          !open && 'hidden',
        )}
        ref={ref}
      >
        {children}
        {renderContent?.(open, content)}
      </div>
    </div>
  );
};
