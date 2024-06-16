'use client';

import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { BiEnvelope } from 'react-icons/bi';
import React, { FC, useEffect, useState } from 'react';
import IconButton from '../buttons/IconButton';
import Carousel from './carousel/Carousel';
import { IProduct } from '@web/shared/types/types';
import { transformDate } from '@web/shared/lib/utils';

type Props = {
  item: IProduct;
};

interface Coords {
  lat: number | undefined;
  lng: number | undefined;
}

const HeroCard: FC<Props> = ({ item }) => {
  const [favorite, setFavorite] = useState(Boolean(item.isInFavourite));
  const [coords, setCoords] = useState<Coords>({
    lat: undefined,
    lng: undefined,
  });

  useEffect(() => {
    if (favorite !== Boolean(item.isInFavourite)) {
      setFavorite(Boolean(item.isInFavourite));
    }
  }, [item.isInFavourite]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      setCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    });
  }, []);

  const handleAddFavourite = () => {};

  return (
    <div className='flex flex-col rounded-lg max-w-[217px] h-[310px] md:h-[340px] w-full  shadow-md hover:shadow-lg'>
      <div className='mt-6'>
        <Carousel images={item.images} />
      </div>
      <div>
        <div className='px-2 mt-2 flex flex-col'>
          <div className='flex justify-between'>
            <div className='text-gray-900 font-semibold text-lg'>
              {item.prices
                .filter((it) => it.type !== 'DEPOSIT')
                .sort((a, b) => a.amount - b.amount)[0].amount + ' c' ||
                'Договорная'}
            </div>
            <div>
              <IconButton
                icon={favorite ? AiFillHeart : AiOutlineHeart}
                variant='ghost'
                classNames={{
                  icon: `text-lg ${favorite ? 'text-red-500' : ''}`,
                }}
                onClick={handleAddFavourite}
              />
              <IconButton
                icon={BiEnvelope}
                variant='ghost'
                classNames={{ icon: 'text-lg' }}
              />
            </div>
          </div>
          <div>
            <div className='text-gray-800 font-semibold text-sm box-content h-[42px] max-w-[200px] w-full overflow-hidden'>
              {item?.name}
            </div>
            <div className='text-gray-600 text-[12px] font-semibold flex justify-between'>
              <div>{transformDate(item.updatedAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroCard;
