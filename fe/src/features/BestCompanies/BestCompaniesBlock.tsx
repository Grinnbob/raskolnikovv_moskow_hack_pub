import { Heading } from '@web/shared/ui/Heading';
import { Text } from '@web/shared/ui/Text';
import { CompanyButton } from './ui/CompanyButton';
import { CompanyModel } from '@web/shared/types/models/company.model';
import { CategoryModel } from '@web/shared/types/models/category.model';
import { FC } from 'react';

type BestCompaniesBlockProps = {
  companies?: CompanyModel[];
  category?: CategoryModel;
};

export const BestCompanyBlock: FC<BestCompaniesBlockProps> = ({
  companies,
  category,
}) => {
  if (!companies?.length) return null;
  return (
    <div className='p-[20px] rounded-[12px] bg-appGry text-black'>
      <Headng level={4}>Лучшие компании</Headng>
      {/* <Text size='s' className='block mb-4'>
        популярно среди UX/UI Designer
      </Text> */}
      {category?.title ? (
        <Text size='s' className='block mb-4'>
          в сфере {category.title}
        </Text>
      ) : null}
      <div className='fle mt-6 flex-col gap-4'>
        {companies?.map((company) => (
          <CompanyButton
            key={company.id}
            name={company.name}
            image={company.imageName}
          />
        ))}
      </div>
    </div>
  );
};
