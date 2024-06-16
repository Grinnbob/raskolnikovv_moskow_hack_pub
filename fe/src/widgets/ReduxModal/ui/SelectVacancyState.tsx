import { VacancyFormSlice } from '@web/shared/types/types';
import { Heading } from '@web/shared/ui/Heading';
import { Text } from '@web/shared/ui/Text';
import { FC, useMemo } from 'react';
import { ModalApi } from '../lib/types';
import { EDateFormat, formatRU } from '@web/shared/lib/formatRu';
import { RxCross1 } from 'react-icons/rx';

export type SelectVacancyStateProps = ModalApi & {
  onSelect: (stateId: string) => void;
  slice: VacancyFormSlice;
  dropFormState: (stateId: string) => void;
};

const SelectVacancyState: FC<SelectVacancyStateProps> = ({
  onSelect,
  close,
  slice,
  dropFormState,
}) => {
  const sortedStates = useMemo(() => {
    return Object.entries(slice.states).sort((a, b) => {
      return Number(a[0]) - Number(b[0]);
    });
  }, [slice]);
  return (
    <div className='w-[450px]'>
      <Heading level={3} className='mb-2'>
        Черновик создания вакансии
      </Heading>
      <Text className='block'>
        Вы недавно заполняли форму создания вакансии, выберите черновик из
        списка ниже, чтобы продолжить заполнение.
      </Text>
      <div className='flex flex-col gap-4 max-h-[200px] overflow-auto mt-4'>
        {sortedStates.map((stateEntry, index, thisArr) => {
          return (
            <div
              key={stateEntry[0]}
              className='flex justify-between items-center gap-4'
            >
              <div
                className='p-2.5 bg-blue50 cursor-pointer hover:bg-addBlue grow'
                onClick={() => {
                  onSelect(stateEntry[0]);
                  close();
                }}
              >
                <Text color='blue' size='s'>
                  Дата и время сохранения:
                </Text>
                <Text className='block' color='blue'>
                  {formatRU(
                    new Date(Number(stateEntry[0])),
                    EDateFormat.fullDate,
                  )}
                </Text>
              </div>
              <RxCross1
                size={24}
                className='cursor-pointer text-textLight'
                onClick={() => {
                  dropFormState(stateEntry[0]);
                  if (thisArr.length === 1) {
                    close();
                  }
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SelectVacancyState;
