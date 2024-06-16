'use client';

import { useState } from 'react';
import { DropDownBase, DropDownBaseProps } from './DropDownBase';
import { Loader } from '@web/shared/ui/Loader';

export type DropDownLazyProps<T> = Omit<
  DropDownBaseProps<T>,
  'children' | 'content' | 'renderContent'
> & {
  fetchData: () => Promise<T>;
  renderContent: (isOpen: boolean, content: T, name: string) => React.ReactNode;
  name: string;
};

export const DropDownLazy = <T,>({
  fetchData,
  renderContent,
  name,
  ...baseProps
}: DropDownLazyProps<T>) => {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<T>();
  return (
    <DropDownBase
      {...baseProps}
      onToggle={(isOpen) => {
        if (isOpen && !content) {
          setLoading(true);
          fetchData()
            .then(setContent)
            .finally(() => {
              setLoading(false);
            });
        }
      }}
    >
      {loading && <Loader />}
      {content && renderContent(true, content, name)}
    </DropDownBase>
  );
};
