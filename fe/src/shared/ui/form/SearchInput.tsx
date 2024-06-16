import { FC } from 'react';
import { CiSearch } from 'react-icons/ci';
import { twMerge } from 'tailwind-merge';

export type SearchInputProps = React.HTMLAttributes<HTMLInputElement> & {};

export const SearchInput: FC<SearchInputProps> = ({ className, ...props }) => {
  return (
    <div className={twMerge('flex items-center', className)}>
      <div className='h-[56px] relative w-full text-gray-500 text-sm'>
        <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
          <CiSearch size='16px' />
        </div>
        <input
          type='text'
          id='voice-search'
          className='h-full focus:ring-black focus:border-black block w-full ps-10 p-2 rounded-[28px] border border-solid border-gray-300 bg-appGray'
          placeholder='Поиск...'
          {...props}
        />
      </div>
    </div>
  );
};
