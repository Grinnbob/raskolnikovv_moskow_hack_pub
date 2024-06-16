import { DropDown } from '@web/entities/DropDown';
import { appRoute } from '@web/shared/const/routes';
import { CarouselCSS } from '@web/shared/ui/CarouselCSS';
import { Heading } from '@web/shared/ui/Heading';
import { Text } from '@web/shared/ui/Text';
import { MainSearch } from '@web/widgets/MainSearch';
import { twMerge } from 'tailwind-merge';

const CompareVacancyPage = (props: any) => {
  return (
    <div className='px-4 w-full flex flex-col justify-center items-center mb-4'>
      <div className='bg-white z-50 flex flex-col items-center justify-center sticky top-3'>
        <MainSearch redirectOnSearch={appRoute.search} />
      </div>
      <div className='my-4 text-left w-full flex gap-2'>
        <Heading level={2}>Сравнение</Heading>
        {/* <DropDown
          text='Выбрать'
          variant='add'
          classNameBtn='text-mainRed h-full bg-white enabled:hover:bg-addRed'
          className='h-full'
          content={['us designer']}
          renderContent={(isOpen, content) => {
            return (
              <FilterForm
                className='flex flex-col gap-2'
                onChange={(name, value) => {
                  apiFilters.applyFilter?.(name, value);
                }}
              >
                {content?.map((cat) => (
                  <Radio
                    key={cat.value}
                    label={cat.label}
                    value={cat.value}
                    name='searchBy'
                    checked={searchBy === cat.value}
                  />
                ))}
              </FilterForm>
            );
          }}
        /> */}
      </div>
      <div className={twMerge(`w-full`)}>
        <CarouselCSS
          slides={['pervyi', 'vtoroi']}
          classNameArrows='top-20'
          renderSlide={(slide) => <>{slide}</>}
          noScroll
          noControls
          noArrows
        />
      </div>
    </div>
  );
};

export default CompareVacancyPage;
