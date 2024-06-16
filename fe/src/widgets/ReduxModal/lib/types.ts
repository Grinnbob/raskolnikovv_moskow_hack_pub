import { ChooseAuthRoleModalStateProps } from '@web/features/Auth/ui/ChooseAuthRoleModal';
import { ConfirmationProps } from '../ui/Confirmation';
import { SelectVacancyStateProps } from '../ui/SelectVacancyState';

export type ModalApi = {
  close: () => void;
  noCloseIcon?: boolean;
};

export type OmitDefaultModalApi<T> = Omit<
  T,
  keyof Omit<ModalApi, 'noCloseIcon'>
>;

export type ModalState =
  | {
      type: 'Confirmation';
      props: OmitDefaultModalApi<ConfirmationProps>;
    }
  | {
      type: 'SelectVacancyState';
      props: OmitDefaultModalApi<SelectVacancyStateProps>;
    }
  | {
      type: 'ChooseAuthRole';
      props: OmitDefaultModalApi<ChooseAuthRoleModalStateProps>;
    };
