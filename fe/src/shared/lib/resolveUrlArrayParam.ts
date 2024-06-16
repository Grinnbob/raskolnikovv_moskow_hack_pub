export const resolveUrlArrayParam = (param: string | string[]) => {
  return typeof param === 'string' ? [param] : param;
};
