import { Heading } from '@web/shared/ui/Heading';
import { CompanyButtonWithCount } from './ui/CompanyButton';
import { CompanyModel } from '@web/shared/types/models/company.model';
import { FC } from 'react';

type BestCompaniesInfoProps = {
  companies?: CompanyModel[];
};

export const BestCompanyInfo: FC<BestCompaniesInfoProps> = ({
  companies,
}) => {
  if (!companies?.length) return null;

  return (
    <div className='text-blck'>
      <Heading level={4}>Лучшие компании</Heading>
      <div className='flex mt-4 flex-col gap-4'>
        {companies
          ?.slice(0, 3)
          .map((company) => (
            <CompanyButtonWithCount
              key={company.id}
              name={company.name}
              count={company.vacanciesCount}
              image={company.imageName}
            />
          ))}
      </div>
    </div>
  );
};
