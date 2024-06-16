import { Moment } from 'moment';
import { preprocess, date } from 'zod';

export const dateSchema = (
  minDate?: Date,
  minMessage?: string,
  maxDate?: Date,
  maxMessage?: string,
) =>
  preprocess(
    (arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
      try {
        return (arg as Moment).toDate();
      } catch (e) {
        return arg;
      }
    },
    date()
      .min(
        minDate ? minDate : new Date('1920-01-01'),
        minMessage ? minMessage : 'Похоже, вы староваты для работы!',
      )
      .max(
        maxDate ? maxDate : new Date('2004-01-01'),
        maxMessage ? maxMessage : 'Похоже, вы ещё молоды для работы!',
      ),
  );

export const customErrorMap = (message?: string) => (issue: any, _ctx: any) => {
  switch (issue.code) {
    case 'invalid_type':
      return { message: 'Введён неверный тип данных' };
    case 'invalid_enum_value':
      return {
        message: message
          ? message
          : 'Должно быть выбрано одно из этих значений',
      };
    default:
      return { message: 'Хм, что-то пошло не так..' };
  }
};
