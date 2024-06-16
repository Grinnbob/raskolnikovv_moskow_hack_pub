'use client';

import { useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { MdKeyboardArrowDown } from 'react-icons/md';
import styles from './styles.module.scss';
import { useClickOutside } from '@web/shared/lib/hooks/useClickOutside';
import IconButton from '@web/shared/ui/buttons/IconButton';
import { Input } from '@web/shared/ui/form/Input';
import { Loader } from '@web/shared/ui/Loader';
import { CiSearch } from 'react-icons/ci';

export type AutocompleteProps<T> = {
  className?: string;
  classNameBtn?: string;
  content: T[] | (() => Promise<T[]>);
  renderContent?: (open: boolean, content?: T[]) => React.ReactNode;
  onCompare: (item: T, query: string) => boolean;
  lazy?: boolean;
};

export const Autocomplete = <T,>({
  className,
  classNameBtn,
  content,
  renderContent,
  onCompare,
  lazy,
}: AutocompleteProps<T>) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialContent, setInitialContent] = useState<T[]>([]);
  const [filtered, setFiltered] = useState<T[]>([]);
  const [query, setQuery] = useState('');
  const mutableState = useRef<{
    onCompare: typeof onCompare;
    awaited?: Promise<T[]>;
    lastCb?: () => void;
  }>({
    onCompare,
  });

  mutableState.current.onCompare = onCompare;

  useEffect(() => {
    if (initialContent.length) return;
    if (Array.isArray(content)) {
      setInitialContent(content);
    } else if (content instanceof Function && (open || !lazy)) {
      setLoading(true);
      mutableState.current.awaited = content();
      mutableState.current.awaited
        .then((content) => {
          setInitialContent(content);
          mutableState.current.lastCb?.();
          mutableState.current.lastCb = undefined;
        })
        .finally(() => {
          mutableState.current.awaited = undefined;
          setLoading(false);
        });
    }
  }, [content, open]);

  const handleQuery = (queryStr: string) => {
    if (queryStr) {
      setOpen(true);
      setFiltered(
        initialContent.filter((item) => {
          return mutableState.current.onCompare(item, queryStr.trim());
        }),
      );
    } else {
      setFiltered(initialContent);
    }
  };

  useEffect(() => {
    if (initialContent.length === 0 && mutableState.current.awaited) {
      mutableState.current.lastCb = handleQuery.bind(null, query);
    } else {
      handleQuery(query);
    }
  }, [query, initialContent]);

  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div className={twMerge('relative', className)}>
      <div className='flex relative w-full justify-between bg-white items-center px-[8px]'>
        <CiSearch size={26} />
        <Input
          className='w-full border-none focus:ring-0'
          onChange={(e) => setQuery((e.target as HTMLInputElement).value)}
        />
        <IconButton
          variant='ghost'
          onClick={() => {
            setOpen(!open);
          }}
          className={twMerge(
            'transition-all',
            classNameBtn,
            open && styles.rotateChild,
          )}
          icon={MdKeyboardArrowDown}
        />
      </div>
      <div
        className={twMerge(
          'z-100 bg-white divide-y divide-gray-100 rounded-[8px] w-max absolute p-[16px]',
          styles.content,
          !open && 'hidden',
        )}
        ref={ref}
      >
        {loading && <Loader />}
        {content && renderContent?.(open, filtered)}
      </div>
    </div>
  );
};
