import { FaCheck } from 'react-icons/fa6';
import { twMerge } from 'tailwind-merge';
import styles from './styles.module.scss';

export type StepsProps<T> = {
  currentIndex: number;
  steps: T[];
  onStepClick: (step: T, i: number) => void;
  allowNextClick?: boolean;
};

export const Steps = <T extends string | { title: string }>({
  currentIndex,
  steps,
  onStepClick,
}: StepsProps<T>) => {
  return (
    <ol className='overflow-hidden space-y-4'>
      {steps.map((step, arr) => {
        const isCompleted = currentIndex > index;
        const isCurrent = currentIndex === index;
        const stepName = typeof step === 'string' ? step : step.title;
        return (
          <li
            key={index}
            className={twMerge(
              'relative flex-1 cursor-pointer',
              styles.line,
              isCompleted ? 'after:bg-appIconBlue' : 'after:bg-infoBg',
            )}
            onClick={!isCurrent ? () => onStepClick(step, index) : undefined}
          >
            <a className='flex items-center font-medium w-full'>
              <span
                className={twMerge(
                  'w-4 h-4 border-2 bg-gray-3 border-textLight rounded-full flex justify-center items-center mr-3 text-sm text-white',
                  isCompleted && 'bg-appIconBlue',
                  isCurrent || isCompleted
                    ? 'border-appIconBlue'
                    : 'border-infoBg',
                )}
              >
                {isCompleted && <FaCheck size={10} />}
              </span>
              <p
                className={
                  isCurrent || isCompleted ? 'text-black' : 'text-textLight'
                }
              >
                {stepName}
              </p>
            </a>
          </li>
        );
      })}
    </ol>
  );
};
