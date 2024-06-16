'use client';

import { FC, useState } from 'react';
import MultiRangeSlider, {
  MultiRange,
  MultiRangeSliderProps,
} from '@web/shared/ui/form/MultiRange/MultiRange';
import { Heading } from '@web/shared/ui/Heading';
import { Text } from '@web/shared/ui/Text';

export type WorkExpirienceProps = Pick<
  MultiRangeSliderProps,
  'defaultMax' | 'defaultMin'
>;

export const WorkExpirience: FC<WorkExpirienceProps> = ({
  defaultMax,
  defaultMin,
}) => {
  const [state, setState] = useState<MultiRange>();
  return (
    <div className='mb-4'>
      <div className='mb-4 flex justify-between'>
        <Heading level={4}>Опыт работы</Heading>
        {state && (
          <Text className='block text-textBlue mt-1' size='s'>
            {state?.min} - {state?.max === 20 ? 'более ' + 20 : state?.max} лет
          </Text>
        )}
      </div>
      <MultiRangeSlider
        key={`${defaultMin}_${defaultMax}`}
        nameMin='workExperienceYearsMin'
        nameMax='workExperienceYearsMax'
        min={0}
        max={20}
        defaultMax={defaultMax}
        defaultMin={defaultMin}
        onChange={setState}
      />
    </div>
  );
};
