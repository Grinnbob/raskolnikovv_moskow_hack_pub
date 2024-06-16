export const appRoute = {
  main: '/',
  search: '/search',
  signin: '/auth/signin',
  signup: '/auth/signup',
  ['confirm-email']: '/auth/confirm-email',
  ['restore-password']: '/auth/restore-password',
  createvacancy: '/create-vacancy/',
} as const;

export type AppRoute = keyof typeof appRoute;
