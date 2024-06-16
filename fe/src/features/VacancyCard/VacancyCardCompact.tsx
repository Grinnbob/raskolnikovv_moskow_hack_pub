import { Badge } from '@web/shared/ui/Badge';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { Heading } from '@web/shared/ui/Heading';
import { Text } from '@web/shared/ui/Text';
import { heartIcon, lightningIcon, verifiedIcon } from './lib/icons';

import styles from './styles.module.scss';
import { VacancyModel } from '@web/shared/types/models/vacancy.model';
import { WorkLocationType } from '@web/shared/types/enums/resume-vacancy';

export const VacancyCardCompact = ({ vacancy }: { vacancy: VacancyModel }) => {
  return (
    <div className='pt-[33px] pb-[20px] px-[20px] rounded-[12px] bg-appGray text-black relative'>
      <Text
        className={`flex gap-2 absolute top-[-15px] left-0 bg-white py-[4px] pl-[16px] pr-[12px] ${styles.customRadius}`}
      >
        {lightningIcon}
        Топ
      </Text>
      <Heading level={4}>{vacancy.title}</Heading>
      <Text size='s' className='block mb-4'>
        {vacancy.company?.isVerified ? verifiedIcon : null}
        {vacancy.company?.name}
      </Text>
      <Text>
        {vacancy.salaryMin} – {vacancy.salaryMax} ₽
      </Text>
      <div className='flex gap-2 mt-2 mb-4 flex-wrap'>
        {vacancy.workExperienceYearsMin ? (
          <Badge
            text={`Опыт от ${vacancy.workExperienceYearsMin} ${vacancy.workExperienceYearsMin === 1 ? 'года' : 'лет'}`}
            variant='bare'
          />
        ) : null}
        {vacancy.workLocationType === WorkLocationType.REMOTE ? (
          <Badge text='Удаленная работа' variant='bare' />
        ) : null}
        {vacancy.benefits?.length ? (
          <Badge text={vacancy.benefits[0].title} variant='bare' />
        ) : null}
      </div>
      <div className='mt-8 flex items-center height-[40px] gap-2'>
        <AppButton
          icon={heartIcon}
          size='md'
          className='text-textLight hover:text-white bg-white h-full'
        >
          {vacancy.likesCount || 0}
        </AppButton>
        <AppButton
          size='md'
          className='text-textBlue hover:text-white bg-white h-full w-full'
        >
          Подбробнее
        </AppButton>
      </div>
    </div>
  );
};
