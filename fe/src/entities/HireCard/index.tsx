import { hireStatusMap } from '@web/shared/const/languageMappers';
import { EDateFormat, formatRU } from '@web/shared/lib/formatRu';
import { HireModel } from '@web/shared/types/models/hire.model';
import { Text } from '@web/shared/ui/Text';
import { FC } from 'react';
import { VacancyCardInfo } from '../VacancyCard/ui/VacancyCardInfo';
import { CompanyInfo } from '../CompanyInfo/CompanyInfo';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import Link from 'next/link';
import { appRoute } from '@web/shared/const/routes';
import { createSelfHealingId } from '@web/shared/lib/selfHealingId';
import { twMerge } from 'tailwind-merge';
import { HireStatus } from '@web/shared/types/enums/hire';
import { Roles } from '@web/shared/types/models/role.model';
import { HireStatusSelect } from './ui/HireStatusSelect';
import { ResumeInfoCard } from '../ResumeCard/ui/ResumeInfoCard';

export type HireCardProps = {
  hire: HireModel;
  role?: Roles;
};

export const HireCard: FC<HireCardProps> = ({ hire, role }) => {
  const isRecruter = role === Roles.recruiter;
  const statusOption = hire.status
    ? hireStatusMap.find((hireOption) => hireOption.value === hire.status)
    : undefined;
  const status = statusOption?.value;
  return (
    <div className='p-8 rounded-2xl border-strokeLight border text-black relative space-y-4'>
      <div className='flex justify-between'>
        <div className='flex gap-2'>
          {isRecruter ? (
            <HireStatusSelect status={status} hireId={hire.id} />
          ) : (
            <Text
              className={twMerge(
                'p-2 rounded-lg',
                status === HireStatus.REFUSAL
                  ? 'text-mainRed bg-addRed'
                  : 'bg-appGray',
              )}
            >
              {statusOption?.label || 'Неизвестный статус'}
            </Text>
          )}
        </div>
        {hire.createdAt && (
          <Text size='s' color='secondary'>
            Отклик от {formatRU(hire.createdAt, EDateFormat.dayMounthYear)}
          </Text>
        )}
      </div>

      {isRecruter
        ? hire.resume && (
            <div>
              <ResumeInfoCard resume={hire.resume} />
            </div>
          )
        : hire.vacancy && (
            <div className='flex gap-4 justify-between'>
              <VacancyCardInfo item={hire.vacancy} />
              <CompanyInfo
                company={hire.vacancy.company}
                className='mb-4'
                city={hire.vacancy.city?.name}
              />
            </div>
          )}

      <div className='flex gap-2 justify-end mt-2'>
        {!isRecruter ? (
          hire.vacancy?.company?.id && (
            <Link
              href={`company-detail/${createSelfHealingId(hire.vacancy.company.id, hire.vacancy.company.name)}/?forceOpenFeedback=true`}
              prefetch={false}
            >
              <AppButton className='text-textBlue'>Оставить отзыв</AppButton>
            </Link>
          )
        ) : (
          <>
            {hire.resume && (
              <Link
                href={`resume-detail/${createSelfHealingId(hire.resume.id, hire.resume.title)}`}
                prefetch={false}
              >
                <AppButton className='text-textBlue'>Открыть резюме</AppButton>
              </Link>
            )}
          </>
        )}
        {hire.roomId && (
          <Link
            href={`${appRoute.chat}/?roomId=${hire.roomId}`}
            prefetch={false}
          >
            <AppButton className='text-textBlue'>Написать в чате</AppButton>
          </Link>
        )}
      </div>
    </div>
  );
};
