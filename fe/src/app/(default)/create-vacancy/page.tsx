'use client';

import { useVacancyForm } from '@web/providers/create-vacancy-form';
import { Heading } from '@web/shared/ui/Heading';
import { Text } from '@web/shared/ui/Text';
import { InfoBlock } from '@web/shared/ui/InfoBlock';
import { twMerge } from 'tailwind-merge';
import styles from './styles.module.scss';
import {
  CreateVacancyProgress,
  VacancyContactForm,
  VacancyInfoForm,
  VacancySettingsForm,
} from '@web/features/CreateVacancySteps';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setModalState } from '@web/providers/redux/slices/general-slice';

const badgeIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='36'
    height='36'
    viewBox='0 0 36 36'
    fill='none'
  >
    <path
      d='M12.45 27.06V25.32C9.00004 23.235 6.16504 19.17 6.16504 14.85C6.16504 7.42502 12.99 1.60502 20.7 3.28502C24.09 4.03502 27.06 6.28502 28.605 9.39002C31.74 15.69 28.44 22.38 23.595 25.305V27.045C23.595 27.48 23.76 28.485 22.155 28.485H13.89C12.24 28.5 12.45 27.855 12.45 27.06Z'
      fill='#F9C16C'
    />
    <path
      d='M12.75 33C16.185 32.025 19.815 32.025 23.25 33'
      stroke='#F9C16C'
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M18.0001 11.835L16.3951 14.625C16.0351 15.24 16.3351 15.75 17.0401 15.75H18.9451C19.6651 15.75 19.9501 16.26 19.5901 16.875L18.0001 19.665'
      stroke='white'
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const stepsForms = [
  <VacancyInfoForm key='VacancyInfoForm' />,
  <VacancyContactForm key='VacancyContactForm' />,
  <VacancySettingsForm key='VacancySettingsForm' />,
];

const CreateVacancyPage = (props: any) => {
  const dispatch = useDispatch();
  const {
    currentStep,
    setCurrentStep,
    onNext,
    slice,
    loadState,
    stateId,
    dropFormState,
  } = useVacancyForm();

  useEffect(() => {
    if (slice?.states && Object.keys(slice.states).length && !stateId) {
      dispatch(
        setModalState({
          type: 'SelectVacancyState',
          props: { onSelect: loadState, slice, dropFormState },
        }),
      );
    }
  }, [slice, stateId]);

  return (
    <div className='px-4 w-full flex flex-col justify-center items-center mb-4'>
      <div className='my-4 text-left w-full'>
        <Heading level={2}>Расскажите о компании</Heading>
        <Text size='s'>
          Сохраним данные и предзаполним их во время создания вакансии
        </Text>
      </div>
      <div className={twMerge(`w-full`, styles.layout)}>
        <div className='grow-1 z-10 bg-white flex flex-col gap-6 border border-strokeLight rounded-[16px] p-8 relative mt-12'>
          {stepsForms[currentStep]}
        </div>
        <aside className='bg-white flex flex-col gap-6 mt-12'>
          <InfoBlock
            className='rounded-2xl p-5 flex flex-col gap-4'
            variant='blue'
            badgeIcon={badgeIcon}
          >
            <Heading level={4} className='text-textBlue text-left'>
              О зарплате
            </Heading>
            <Text size='s' color='blue'>
              Если вы не укажете зарплату, мы не сможем гарантировать
              релевантных соискателей. Отклик на такие вакансии существенно ниже
            </Text>
          </InfoBlock>
          <CreateVacancyProgress
            currentIndex={currentStep}
            onStepClick={(step, index) => {
              if (currentStep >= index) {
                setCurrentStep(index);
              } else {
                onNext();
              }
            }}
          />
        </aside>
      </div>
    </div>
  );
};

export default CreateVacancyPage;
