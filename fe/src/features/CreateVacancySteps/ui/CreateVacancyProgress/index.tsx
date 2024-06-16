import { InfoBlock } from '@web/shared/ui/InfoBlock';
import { Steps } from '@web/shared/ui/Steps';
import { Text } from '@web/shared/ui/Text';
import { FC } from 'react';

const steps = [
  'Информация о вакансии',
  'Контактные данные',
  'Настройки размещения',
];

export type ProgressProps = {
  currentIndex: number;
  onStepClick: (stepname: string, index: number) => void;
};

export const CreateVacancyProgress: FC<ProgressProps> = ({
  currentIndex,
  onStepClick,
}) => {
  return (
    <InfoBlock
      className='rounded-2xl p-5 flex flex-col gap-4'
      variant='gray'
      badgeIcon={
        <Text
          className={currentIndex > 0 ? 'text-appIconBlue' : 'text-strokeLight'}
          size='xl'
        >
          {(Math.max(currentIndex / steps.length) * 100).toFixed(0)}%
        </Text>
      }
    >
      <Steps
        steps={steps}
        currentIndex={currentIndex}
        onStepClick={onStepClick}
      />
    </InfoBlock>
  );
};
