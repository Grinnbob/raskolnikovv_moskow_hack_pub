'use client';

import { AppButton } from '@web/shared/ui/buttons/AppButton';

export const ControlButtons = () => {
  return (
    <>
      <AppButton variant='accept' size='xl'>
        Откликнуться
      </AppButton>
      <AppButton variant='add' size='xl'>
        Сравнить
      </AppButton>
      <AppButton variant='add' size='xl'>
        Написать HR
      </AppButton>
    </>
  );
};
