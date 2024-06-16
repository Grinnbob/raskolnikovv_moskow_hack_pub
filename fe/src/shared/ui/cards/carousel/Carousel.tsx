'use client';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/scrollbar';
import './Carousel.css';
import { Scrollbar } from 'swiper/modules';
import { Image } from '@web/shared/types/types';
import { FC } from 'react';
import NextImage from '@web/shared/ui/NextImage';
import { generateUrlImg } from '@web/shared/lib/utils';

type Props = {
  images: Image[];
};

const Carousel: FC<Props> = ({ images }) => {
  return (
    <>
      <Swiper
        scrollbar={{
          hide: false,
        }}
        modules={[Scrollbar]}
        className='rounded-lg cursor-pointer w-full h-[180px] md:w-[200px] md:h-[200px] z-0'
      >
        {images?.map((image) => (
          <SwiperSlide key={image.id}>
            <NextImage
              useSkeleton
              src={generateUrlImg(image.url)}
              alt='slide'
              width={200}
              height={200}
              className='z-0'
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
};

export default Carousel;
