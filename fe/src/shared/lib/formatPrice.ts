import { Currency } from '../types/enums/resume-vacancy';

export const formatPrice = (value: number, currency?: Currency) => {
  return value.toLocaleString('ru-RU', {
    style: currency ? 'currency' : 'decimal',
    currency,
    maximumFractionDigits: 0,
  });
};
