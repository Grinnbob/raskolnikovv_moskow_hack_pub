import React from 'react';
import { ModalApi } from '../lib/types';

export const modalContentMap: Record<
  string,
  React.ComponentType<any & ModalApi>
> = {
  Confirmation: React.lazy(() => import('./Confirmation')),
  SelectVacancyState: React.lazy(() => import('./SelectVacancyState')),
  ChooseAuthRole: React.lazy(
    () => import('@web/features/Auth/ui/ChooseAuthRoleModal'),
  ),
};
