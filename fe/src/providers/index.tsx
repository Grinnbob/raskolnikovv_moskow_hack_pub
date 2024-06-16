'use client';

import { ReduxProvider } from './redux';
import { SessionProvider } from 'next-auth/react';

export const RootAppProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SessionProvider>
      <ReduxProvider>{children}</ReduxProvider>
    </SessionProvider>
  );
};
