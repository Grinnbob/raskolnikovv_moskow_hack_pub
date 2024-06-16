'use client';

import { ICategories } from '@web/shared/types/types';
import { useParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';

interface FileProps extends ICategories {
  showChildrenParent?: (value: boolean) => void;
}

const File: React.FC<FileProps> = ({
  name,
  children,
  id,
  showChildrenParent,
  itemsCount,
}) => {
  const [showChildren, setShowChildren] = useState<boolean>(false);

  const handleClick = () => {
    setShowChildren(!showChildren);
  };

  const paramsId = useParams().id;
  useEffect(() => {
    if (+paramsId === id) {
      setShowChildren(true);
      showChildrenParent && showChildrenParent(true);
    }
  }, [paramsId, id, showChildrenParent]);

  const handle = useCallback(
    (value: boolean) => {
      setShowChildren(value);
      showChildrenParent && showChildrenParent(value);
    },
    [showChildrenParent],
  );
  return (
    <div className='h-full transition-[margin-left] ease-in-out duration-100'>
      <span
        onClick={handleClick}
        className='w-full flex justify-between items-center cursor-pointer'
      >
        <Link href={`/category/${id}`}>
          <h5
            className={
              `${
                showChildren
                  ? 'font-[700] text-gray-90'
                  : 'font-[500] text-gray-60 hover:bg-te'
              }` +
              'w-full px-2 py-1 rounded-md hover:bg-gray-200 hover:text-primary-950'
            }
          >
            {name}{' '}
            <span className='text-sm text-gray-40 border-solid rounded-full'>
              {itemsCount}
            </span>
          </h5>
        </Link>
      </span>
      <div className='relative w-full left-2'>
        <div style={{ display: showChildren ? 'block' : 'none' }}>
          {(children ?? []).map((node: ICategories) => (
            <File {...node} key={node.id} showChildrenParent={handle} />
          ))}
        </div>
      </div>
    </div>
  );
};

type Props = {
  categories: ICategories[];
};

const RecursiveNavigation: React.FC<Props> = ({ categories }) => {
  return (
    <div>
      {categories.map((item) => (
        <File {...item} key={item.id} />
      ))}
    </div>
  );
};

export default RecursiveNavigation;
