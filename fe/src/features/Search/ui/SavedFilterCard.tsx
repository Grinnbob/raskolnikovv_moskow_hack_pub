'use client';

import { FilterModel } from '@web/shared/types/models/filter';
import { Heading } from '@web/shared/ui/Heading';
import { FC } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { twMerge } from 'tailwind-merge';

export type SavedFilterCardProps = React.HTMLAttributes<HTMLDivElement> & {
  data: FilterModel;
  onDelete?: () => void;
};

export const SavedFilterCard: FC<SavedFilterCardProps> = ({
  data,
  onDelete,
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        'p-3 flex justify-between items-start border-strokeLight border rounded-xl',
        className,
        props.onClick && 'cursor-pointer',
      )}
      {...props}
    >
      <Heading level={5}>{data.title}</Heading>
      {onDelete && (
        <RxCross1
          size={16}
          className='cursor-pointer text-textLight hover:text-black hover:scale-125'
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        />
      )}
    </div>
  );
};
