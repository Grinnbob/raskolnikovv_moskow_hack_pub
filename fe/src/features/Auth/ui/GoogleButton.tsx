'use client';

import { appRoute } from '@web/shared/const/routes';
import { EAppCookieKeys } from '@web/shared/types/enums/common';
import { Roles } from '@web/shared/types/models/role.model';
import { AppButton } from '@web/shared/ui/buttons/AppButton';
import { setCookie } from 'cookies-next';
import { signIn } from 'next-auth/react';
import { useDispatch } from 'react-redux';
import { SlSocialGoogle } from 'react-icons/sl';
import { setModalState } from '@web/providers/redux/slices/general-slice';
import { FC } from 'react';

export type GoogleButtonProps = {
  children: React.ReactNode;
};

export const GoogleButton: FC<GoogleButtonProps> = ({ children }) => {
  const dispatch = useDispatch();
  const handleGoogle = async (role: Roles) => {
    setCookie(EAppCookieKeys.authRole, role);
    await signIn('google', { callbackUrl: appRoute.main });
  };
  return (
    <AppButton
      icon={<SlSocialGoogle size={20} />}
      onClick={() =>
        dispatch(
          setModalState({
            type: 'ChooseAuthRole',
            props: {
              onSelect: handleGoogle,
              noCloseIcon: true,
            },
          }),
        )
      }
      variant='addBlue'
      className='px-7 py-2'
    >
      {children}
    </AppButton>
  );
};
