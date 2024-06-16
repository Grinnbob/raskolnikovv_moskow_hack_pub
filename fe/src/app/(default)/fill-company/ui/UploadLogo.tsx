'use client';

import { ICompany, imageValidation } from '@web/shared/const/validations';
import { useImageSrc } from '@web/shared/lib/hooks/useImageSrc';
import { BackendAPI } from '@web/shared/services/BackendAPI';
import NextImage from '@web/shared/ui/NextImage';
import { Text } from '@web/shared/ui/Text';
import { FC } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { GoPlus } from 'react-icons/go';
import { MdOutlineDelete } from 'react-icons/md';
import { ZodError } from 'zod';

const logoPlug = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
  >
    <path
      d='M28.9066 22.6133L24.7333 12.8667C23.32 9.56001 20.72 9.42667 18.9733 12.5733L16.4533 17.12C15.1733 19.4267 12.7866 19.6267 11.1333 17.56L10.84 17.1867C9.11998 15.0267 6.69332 15.2933 5.45332 17.76L3.15998 22.36C1.54665 25.56 3.87998 29.3333 7.45332 29.3333H24.4666C27.9333 29.3333 30.2666 25.8 28.9066 22.6133Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M9.29321 10.6667C11.5024 10.6667 13.2932 8.87589 13.2932 6.66675C13.2932 4.45761 11.5024 2.66675 9.29321 2.66675C7.08407 2.66675 5.29321 4.45761 5.29321 6.66675C5.29321 8.87589 7.08407 10.6667 9.29321 10.6667Z'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export type UploadLogoProps = {
  logoUrl?: string;
  imageId?: number;
  setValue?: UseFormSetValue<ICompany>;
  api: BackendAPI;
};

export const UploadLogo: FC<UploadLogoProps> = ({
  logoUrl,
  imageId,
  setValue,
  api,
}) => {
  const { src, setSrc, selectSrc } = useImageSrc(logoUrl, (image) => {
    //@ts-ignore
    const { error } = imageValidation.safeParse({ image: [image] });
    const msg = (error as ZodError)?.issues?.[0]?.message;
    if (msg) return msg;
    setValue?.('image', [image], { shouldValidate: false });
  });
  return (
    <div className='flex gap-3 items-center justify-between w-max bg-white absolute top-[-43px]'>
      <div className='overflow-hidden rounded-full border border-textBlue w-20 h-20 flex justify-center items-center text-textBlue'>
        {src ? (
          <NextImage useSkeleton src={src} alt='logo' width={60} height={60} />
        ) : (
          logoPlug
        )}
      </div>
      {!src ? (
        <button className='flex gap-3 pr-3' onClick={selectSrc}>
          <GoPlus size={24} className='text-textBlue' />
          <Text color='blue'>Добавить лого</Text>
        </button>
      ) : (
        <button
          className='flex gap-3 pr-3'
          onClick={() => {
            if (imageId) {
              api.deleteCompanyImage(imageId).then(() => {
                setSrc();
              });
            } else {
              setSrc();
            }
          }}
        >
          <MdOutlineDelete size={24} className='text-mainRed' />
          <Text className='text-mainRed'>Удалить лого</Text>
        </button>
      )}
    </div>
  );
};
