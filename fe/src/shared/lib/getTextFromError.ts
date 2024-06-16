import { DEFAULT_ERROR_TEXT } from '../const/config';

export const getTextFromError = async (e?: any) => {
  const title = typeof e?.message === 'string' ? e?.message : 'unknown error';
  let message = DEFAULT_ERROR_TEXT;

  if (typeof e?.response?.json === 'function') {
    const errData = await e?.response?.json?.();
    const text =
      typeof errData?.message === 'string'
        ? errData.message
        : errData?.message.join?.('\n');
    text && (message = text);
  }

  return title + (message ? `: ${message}` : '');
};
