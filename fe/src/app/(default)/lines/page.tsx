import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { SearchInput } from '@web/shared/ui/form/SearchInput';
import React from 'react';
import { BiSort } from 'react-icons/bi';

export default () => {
  return (
    <div className='p-4 w-full'>
      <div className='flex gap-3 w-full items-center'>
        <div className='flex basis-full gap-3'>
          <SearchInput className='w-3/5 grow' placeholder='Найти пост...' />
          <SearchInput
            className='w-2/5'
            placeholder='Исключить слова, через запятую'
          />
        </div>
        <div className='w-[100px] flex items-center gap-3'>
          <AppButton>Найти</AppButton>
          <BiSort size='24px' color='rgba(96, 100, 108, 1)' />
        </div>
      </div>
      content
    </div>
  );
};
