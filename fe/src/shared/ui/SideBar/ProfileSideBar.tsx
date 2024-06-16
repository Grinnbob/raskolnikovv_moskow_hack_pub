'use client';
import React, { FC, useState } from 'react';
import { FiMenu as Icon } from 'react-icons/fi';
import Link from 'next/link';
import { profileNavItems } from '@web/shared/const/config';

const ProfileSideBar = <
  P extends React.ComponentType<{ href: string; className?: string }>,
>({
  LinkComponent,
}: {
  LinkComponent?: P;
}) => {
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const LinkComponentRender = LinkComponent || Link;
  const className =
    'bg-white w-[25px] transition-[margin-left] ease-in-out duration-500 fixed md:static top-0 bottom-0 left-0 z-40';
  const appendClass = showSidebar ? ' ml-0' : ' ml-[-20px] md:ml-0';

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
        <div className='md:hidden z-2 flex [&>*]:my-auto'>
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
        <div className='flex'>
          <ul>
            {profileNavItems.map((item) => (
              <li key={item.name}>
                <LinkComponentRender
                  href={item.link}
                  className='relative flex flex-row items-center h-1 focus:outline-none hover:bg-gray-50 text-gray-800 hover:text-gray-800 border-l-4 border-transparent hover:border-black'
                >
                  <span className='inline-flex justify-center items-center ml-2'>
                    <item.icon />
                  </span>
                  <span className='ml-2 text-sm tracking-wide truncate'>
                    {item.name}
                  </span>
                </LinkComponentRender>
              </li>
            ))}
          </ul>
      </div>
      {showSidebar && <ModalOverlay />}
    </div>
  );
};

export default ProfileSideBar;
