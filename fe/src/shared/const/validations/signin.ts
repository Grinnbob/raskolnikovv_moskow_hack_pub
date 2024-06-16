import { nativeEnum, object, string, TypeOf } from 'zod';
import { customErrorMap } from '@web/shared/lib/schemaValidationUtils';
import { Roles } from '@web/shared/types/models/role.model';

export const emailRestoreSchema = object({
  email: string().email('Введите корректную почту!'),
  role: nativeEnum(Roles, {
    errorMap: customErrorMap(),
  })
    .optional()
    .nullable(),
});

export type IRestore = TypeOf<typeof emailRestoreSchema>;

export const loginSchema = emailRestoreSchema.extend({
  email: string().email('Введите корректную почту!'),
  password: string()
    .min(1, 'Пароль обязателен!')
    .max(32, 'Слишком длинный пароль!'),
});

export type ILogin = TypeOf<typeof loginSchema>;

export const signupSchema = loginSchema
  .extend({
    passwordConfirm: string().min(1, 'Подтвердите введённый пароль'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Пароли не совпадают!',
  });

export type ISignUp = TypeOf<typeof signupSchema>;
