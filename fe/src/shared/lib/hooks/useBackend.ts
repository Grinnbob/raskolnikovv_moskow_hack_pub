import { DEFAULT_ERROR_TEXT } from '@web/shared/const/config';
import { setConfig } from '@web/shared/http';
import {
  BackendAPI,
  backendApiInstance,
} from '@web/shared/services/BackendAPI';
import { signOut, useSession } from 'next-auth/react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { getTextFromError } from '../getTextFromError';
import { appRoute } from '@web/shared/const/routes';

export type UseBackendOptions = {
  onError?: (error: any) => void;
  trackState?: boolean;
  silent?: Array<keyof typeof backendApiInstance>;
  requiredSession?: boolean;
};

const defaultOptions: UseBackendOptions = {
  trackState: false,
  requiredSession: false,
};

export const useBackend = (incOptions: UseBackendOptions = defaultOptions) => {
  const session = useSession({ required: Boolean(incOptions.requiredSession) });
  const tokens = session?.data?.apiTokens;
  const optionsRef = useRef<UseBackendOptions>(incOptions);
  optionsRef.current = incOptions;

  const [pending, setPending] = useState<
    Partial<Record<keyof BackendAPI, boolean>>
  >({});

  if (tokens?.accessToken) {
    setConfig('Authorization', `Bearer ${tokens.accessToken}`);
  }

  const proxy = useRef(
    new Proxy(backendApiInstance, {
      get(target, property) {
        const apiFnName = property as keyof typeof backendApiInstance;
        const originalMethod = target[apiFnName];
        if (
          typeof originalMethod === 'function' &&
          //@ts-ignore
          originalMethod[Symbol.toStringTag] === 'AsyncFunction'
        ) {
          return async function (...args: Parameters<typeof originalMethod>) {
            try {
              optionsRef.current?.trackState &&
                setPending((prev) => ({ ...prev, [property]: true }));
              //@ts-ignore
              const result = await originalMethod.apply(target, args);
              return result;
            } catch (error: any) {
              if (error) {
                const message = await getTextFromError(error);
                const isStr = typeof message === 'string';

                if (error?.response?.status === 401) {
                  let path = appRoute.signin;

                  if (isStr) path += `?error=${message}`;

                  return await signOut({ callbackUrl: path, redirect: true });
                } else {
                  const silent = Boolean(
                    optionsRef.current?.silent?.includes(apiFnName) ||
                      optionsRef.current?.onError,
                  );

                  silent
                    ? optionsRef.current?.onError?.(error)
                    : toast.error(isStr ? message : DEFAULT_ERROR_TEXT);
                }
              }
              throw error;
            } finally {
              optionsRef.current?.trackState &&
                setPending((prev) => ({ ...prev, [property]: false }));
            }
          };
        } else {
          return originalMethod;
        }
      },
    }),
  );

  return { api: proxy.current, ...session, pending };
};
