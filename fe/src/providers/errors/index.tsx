'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export const ErrorProvider = (props: { children: React.ReactNode }) => {
  const params = useSearchParams();
  const error = params.get('error');

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        toast.error(error);
        window.history.replaceState({}, '', window.location.pathname);
      }, 100);
    }
  }, [error]);

  return (
    <>
      {props.children}
      <Toaster position='top-right' toastOptions={{ duration: 4000 }} />
    </>
  );
};
