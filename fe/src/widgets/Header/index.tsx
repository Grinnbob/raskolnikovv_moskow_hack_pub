'use client';

import Link from 'next/link';
import * as React from 'react';
import NextImage from '@shared/ui/NextImage';
import styles from './styles.module.scss';
import { usePathname } from 'next/navigation';
import { TabPanel } from '@web/shared/ui/TabPanel';
import { BsChatText } from 'react-icons/bs';
import { AiOutlineHeart } from 'react-icons/ai';
import { FiBell } from 'react-icons/fi';
import { MdOutlineAccountCircle } from 'react-icons/md';
import IconButton from '@web/shared/ui/buttons/IconButton';
import { useSelector } from 'react-redux';
import { selectNavLinks } from '@web/providers/redux/slices/general-slice';
import { useSession } from 'next-auth/react';
import { Loader } from '@web/shared/ui/Loader';

const Header = () => {
  const pathName = usePathname();
  const links = useSelector(selectNavLinks);
  const { data, status } = useSession();

  return (
    <div className={styles.header}>
      <header className={`${styles.headerContent} layout`}>
        <Link href='/' className='flex items-center gap-2 ml-'>
          <NextImage
            src='/svg/logo.svg'
            alt='Logo'
            width='15'
            height='19'
            useSkeleton
            className='w-13'
          />
          <p className='text-[22px] md:block'>Raskolnikovv</p>
        </Link>
        <TabPanel
          tabs={links}
          isActive={(tab) => tab.href === pathName}
          variant='dot'
        />
        <div className='flex items-center min-w-[200px]'>
          {status === 'authenticated' ? (
            <>
              <IconButton icon={AiOutlineHeart} variant='ghost' size='23px' />
              <IconButton icon={BsChatText} variant='ghost' size='23px' />
              <IconButton icon={FiBell} variant='ghost' size='23px' />
              <IconButton
                icon={MdOutlineAccountCircle}
                variant='ghost'
                size='23px'
              />
              {data.user?.image && (
                <NextImage
                  className='ml-2 rounded-full cursor-pointer overflow-hidden h-[36px]'
                  width='36'
                  height='36'
                  src={data.user.image}
                  alt={data.user.name || ''}
                  useSkeleton
                />
              )}
            </>
          ) : status === 'unauthenticated' ? (
            <Link href='/signin'>Войти/Зарегистрироваться</Link>
          ) : (
            <Loader size='m' />
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;
