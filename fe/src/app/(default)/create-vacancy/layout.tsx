import NoSsr from '@web/entities/NoSsr.tsx';
import { CreateVacancyFormProvider } from '@web/providers/create-vacancy-form';
import { getBackendApiSSR } from '@web/shared/services/BackendAPI';
import { ContactsModel } from '@web/shared/types/models/contacts.model';

const contacts: ContactsModel[] = [
  {
    id: 1,
    isMain: false,
    email: 'email@example.com',
    secondEmail: 'email@example.com',
    phone: '+7 123 456 78 90',
    secondPhone: '+7 123 456 78 90',
    vk: 'vk.com/myacc',
    telegram: 'tg.io/myacc',
    facebook: 'facebook.com/myacc',
    linkedin: 'linkedin.com/myacc',
    instagram: 'instagram.com/myacc',
    slack: 'slack.com/myacc',
    other: 'something else',
  },
];

const CreateVacancyLayout = async (props: { children: React.ReactNode }) => {
  const { api } = await getBackendApiSSR(true);
  const [
    categories,
    skills,
    benefits,
    citezenships,
    languages,
    cities,
    // contacts,
  ] = await Promise.all([
    api.getCategories(),
    api.getSkills(),
    api.getBenefits(),
    api.getCitizenships(),
    api.getLanguages(),
    api.getCities(),
    // backendApiInstance.getUserContacts(user?.id!),
  ]);

  return (
    <CreateVacancyFormProvider
      skills={skills}
      categories={categories}
      benefits={benefits}
      citezenships={citezenships}
      languages={languages}
      cities={cities}
      contacts={contacts}
    >
      <NoSsr>{props.children}</NoSsr>
    </CreateVacancyFormProvider>
  );
};

export default CreateVacancyLayout;
