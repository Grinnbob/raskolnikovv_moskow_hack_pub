import { SearchParams } from './types';
import { VacancyCard } from '@web/features/VacancyCard';
import { backendApiInstance } from '@web/shared/services/BackendAPI';

export const loadFunctions = {
  search: {
    render: (el: any) => <VacancyCard item={el} key={el.id} />,
    load: async (params: SearchParams) => {
      const data = await backendApiInstance.getPaginatedVacancies(params);
      return data;
    },
  },
};
