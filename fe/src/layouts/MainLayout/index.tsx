import { ErrorProvider } from '@web/providers/errors';
import Header from '@web/widgets/Header';
import { ReduxModal } from '@web/widgets/ReduxModal';
import React from 'react';

export const MainLayout = ({
  children,
  className,
  outsideContent,
}: {
  children: React.ReactNode;
  className?: string;
  outsideContent?: React.ReactNode;
}) => {
  return (
    <body className={className}>
      <ErrorProvider>
        <Header />
        <div className='layout'>
          <main className='main'>{children}</main>
          <div id='appOverlay' aria-modal='true' role='dialog' />
          <ReduxModal />
        </div>
        {outsideContent}
      </ErrorProvider>
    </body>
  );
};
