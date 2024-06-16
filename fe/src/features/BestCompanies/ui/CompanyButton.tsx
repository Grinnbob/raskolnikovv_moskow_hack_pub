import { getCompanyVacancyText } from '@web/shared/const/languageMappers';
import { getImageLink } from '@web/shared/lib/getImageLink';
import NextImage from '@web/shared/ui/NextImage';
import { Text } from '@web/shared/ui/Text';
import { FC } from 'react';
import { IoIosArrowForward } from 'react-icons/io';

type CompanyButtonProps = {
  name: string;
  image?: string;
  count?: string | number;
};

export const CompanyButton: FC<CompanyButtonProps> = ({ name, image }) => {
  return (
    <button className='p-[4px] pr-[20px] rounded-[56px] bg-white flex gap-4 items-center w-max'>
      <NextImage
        className='rounded-full cursor-pointer overflow-hidden h-[36px]'
        width='36'
        height='36'
        src={getImageLink('company', image)}
        alt='Company avatar'
        useSkeleton
      />
      <Text>{name}</Text>
      <IoIosArrowForward className='text-mainRed' />
    </button>
  );
};

export const CompanyButtonWithCount: FC<CompanyButtonProps> = ({
  name,
  image,
  count,
}) => {
  return (
    <button className='px-[20px] py-[12px] rounded-[16px] bg-addBlue flex gap-4 items-center w-full'>
      <NextImage
        className='rounded-full cursor-pointer overflow-hidden h-[36px]'
        width='36'
        height='36'
        src={getImageLink('company', image)}
        alt='Company avatar'
        useSkeleton
      />
      <div className='flex flex-col gap-1 items-start'>
        <Text>{name}</Text>
        <Text color='light' size='s'>
          {getCompanyVacancyText(count)}
        </Text>
      </div>
    </button>
  );
};
