import { ICategories } from '@web/shared/types/types';
import React, { FC, useMemo, useState } from 'react';
import { FiMenu as Icon } from 'react-icons/fi';
import RecursiveNavigation from './RecursiveNavigation';

type Props = {
  categories: ICategories[];
};

const SideBar: FC<Props> = ({ categories }) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const c = useMemo(() => {
    return categories;
  }, [categories]);

  const className =
    'bg-white w-[250px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40';
  const appendClass = showSidebar ? ' ml-0' : ' ml-[-250px] md:ml-0';

  const ModalOverlay = () => (
    <div
      className='flex md:hidden fixed top-0 right-0 bottom-0 left-0 bg-black/50 z-30'
      onClick={() => {
        setShowSidebar((oldVal) => !oldVal);
      }}
    />
  );

  return (
    <div>
      <div className='flex absolute left-2 top-[118px]'>
        <div className='md:hidden z-20 flex [&>*]:my-auto'>
          <button
            className='text-xl  text-black'
            onClick={() => {
              setShowSidebar((oldVal) => !oldVal);
            }}
          >
            <Icon />
          </button>
        </div>
      </div>
      <div className={`${className}${appendClass}`}>
        <div className='flex flex-col'>
          <RecursiveNavigation categories={c} />
        </div>
      </div>
      {showSidebar && <ModalOverlay />}
    </div>
  );
};

export default SideBar;
