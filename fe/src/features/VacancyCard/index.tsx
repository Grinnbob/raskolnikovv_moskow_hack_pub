import { Badge } from '@web/shared/ui/Badge';
import { Heading } from '@web/shared/ui/Heading';
import NextImage from '@web/shared/ui/NextImage';
import { Text } from '@web/shared/ui/Text';
import { checkIcon, eyeIcon, peopleIcon, verifiedIcon } from './lib/icons';
import IconButton from '@web/shared/ui/buttons/IconButton';
import { PiDotsThreeOutline } from 'react-icons/pi';
import { VacancyModel } from '@web/shared/types/models/vacancy.model';
import { FC } from 'react';
import { ControlButtons } from './ui/ControlPanel';
import { SocialPanel } from './ui/SocialPanel';
import { getImageLink } from '@web/shared/lib/getImageLink';
import { formatRelativeDate } from '@web/shared/lib/formatRu';
import { Salary } from './ui/Salary';
import { TopBar } from './ui/TopBar';
import { WorkLocationType } from '@web/shared/types/enums/resume-vacancy';

export type VacancyCardProps = {
  item: VacancyModel;
  nowDate?: string | Date;
};

export const VacancyCard: FC<VacancyCardProps> = ({ item, nowDate }) => {
  const tags = [
    item.workExperienceYearsMin &&
      `Опыт от ${item.workExperienceYearsMin} ${item.workExperienceYearsMin === 1 ? 'года' : 'лет'}`,
    item.workLocationType === WorkLocationType.REMOTE && 'Удаленная работа',
    item.workLocationType === WorkLocationType.HYBRID && 'Частичная удалёнка',
    item.isReferral && 'Есть реферальная программа',
  ].filter(Boolean);

  return (
    <div className='p-[32px] rounded-[16px] border-strokeLight border-[1px] text-black relative'>
      <TopBar skills={item.skills} rating={item.rating} />
      <div className='flex gap-4 justify-between'>
        <div>
          <Heading level={2} className='mb-1.5'>
            {item.title}
          </Heading>
          <Salary
            min={item.salaryMin}
            max={item.salaryMax}
            currency={item.salaryCurrency}
          />
          <Text size='xs' color='secondary'>
            {` / в мес на руки`}
          </Text>
          {Boolean(tags.length) && (
            <Text size='s' className='block mt-1'>
              {tags.join(' · ')}
            </Text>
          )}
          {Boolean(item.benefits?.length) && (
            <div className='flex gap-2 mt-2 mb-4 flex-wrap'>
              {item.benefits?.map((benefit) => {
                return (
                  <Badge
                    key={benefit.id || benefit.title}
                    text={benefit.title}
                    icon={checkIcon}
                  />
                );
              })}
            </div>
          )}
          {item.responsibilities && (
            <div>
              <Heading level={5}>Что делать</Heading>
              <Text size='s' className='line-clamp-3'>
                {item.responsibilities}
              </Text>
            </div>
          )}
        </div>
        <div className='w-[256px]'>
          <div className='mb-4 flex justify-end'>
            <div className='text-right w-max'>
              <Text size='s' className='block'>
                {item.company?.isVerified && verifiedIcon}{' '}
                {item.company?.name || '-'}
              </Text>
              <Text size='s' color='secondary'>
                {item.city?.name || '-'}
              </Text>
            </div>
            <NextImage
              src={getImageLink('company', item?.company?.imageName)}
              useSkeleton
              alt={item.company?.imageName || 'company-logo'}
              width={56}
              height={56}
            />
          </div>
          <div className='flex flex-col gap-y-3'>
            <ControlButtons />
          </div>
        </div>
      </div>
      <div className='mt-6 flex justify-between'>
        <SocialPanel
          vacancyId={item.id}
          isLiked={Boolean(item.isLiked)}
          isCommented={Boolean(item.isCommented)}
          isShared={Boolean(item.isShared)}
          likesCount={item.likesCount}
          commentsCount={item.commentsCount}
          sharesCount={item.sharesCount}
        />
        <div className='flex items-center gap-4'>
          {item.updatedAt && (
            <Text size='s' color='light'>
              {formatRelativeDate(item.updatedAt, nowDate || new Date())}
            </Text>
          )}
          <Badge
            text={String(item.viewsCount || 0)}
            icon={eyeIcon}
            variant='transparent'
          />
          <Badge
            text={String(item.respondsCount || 0)}
            icon={peopleIcon}
            variant='transparent'
          />
          <IconButton icon={PiDotsThreeOutline} variant='ghost' />
        </div>
      </div>
    </div>
  );
};
