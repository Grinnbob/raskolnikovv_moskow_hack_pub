import { backendApiInstance } from '@web/shared/services/BackendAPI';
import CompanyInfoForm from './ui/CompanyInfoForm';
import { Heading } from '@web/shared/ui/Heading';
import { Text } from '@web/shared/ui/Text';

async function FillCompanyPage() {
  const industries = await backendApiInstance.getIndustries();
  return (
    <div className='px-4 w-full flex flex-col justify-center items-center mb-4'>
      <div className='my-4 text-left w-full'>
        <Heading level={2}>Расскажите о компании</Heading>
        <Text size='s'>
          Сохраним данные и предзаполним их во время создания вакансии
        </Text>
      </div>
      <CompanyInfoForm industries={industries} />
    </div>
  );
}

export default FillCompanyPage;
