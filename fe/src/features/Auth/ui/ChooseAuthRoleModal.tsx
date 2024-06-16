import { FC } from 'react';
import { ModalApi } from '@web/widgets/ReduxModal/lib/types';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { Roles } from '@web/shared/types/models/role.model';

export type ChooseAuthRoleModalStateProps = ModalApi & {
  onSelect: (role: Roles) => void;
};

const ChooseAuthRoleModal: FC<ChooseAuthRoleModalStateProps> = ({
  onSelect,
  close,
}) => {
  const handleSelect = (role: Roles) => {
    onSelect(role);
    close();
  };
  return (
    <div className='w-[30px]'>
      <div className='w-full flex gap-2 h-20'>
        <AppButton
          variant='addBlue'
          className='w-1/2 h-full rounded-xl'
          onClick={handleSelect.bind(null, Roles.candidate)}
        >
          Я ищу работу
        </AppButton>
        <AppButton
          className='w-1 h-full rounded-xl'
          onClick={handleSelect.bind(null, Roles.recruiter)}
        >
          Я ищу сотрудников
        </AppButton>
      </div>
    </div>
  );
};

export default ChooseAuthRoleModal;
