import { Text } from '@web/shared/ui/Text';
import { FC } from 'react';
import { IoIosArrowForward } from 'react-icons/io';

type SimilarButtonProps = {
  name: string;
  count?: number;
};

export const SimilarButton: FC<SimilarButtonProps> = ({ name, count }) => {
  return (
    <button className='p-[4px] flex gap-4 w-full justify-between items-center group'>
      <Text size='s' className='group-hover:underline'>
        {name}
      </Text>
      <div className='flex items-center'>
        <Text color='red'>{count}</Text>
        <IoIosArrowForward />
      </div>
    </button>
  );
};
