import { formatPrice } from '@web/shared/lib/formatPrice';
import { Currency } from '@web/shared/types/enums/resume-vacancy';
import { Text } from '@web/shared/ui/Text';
import { FC } from 'react';

export type SalaryProps = {
  min?: number;
  max?: number;
  currency?: Currency;
};

export const Salary: FC<SalaryProps> = ({ min, max, currency }) => {
  const hasRange = min && max;

  const salary = hasRange
    ? `${formatPrice(min)} - ${formatPrice(max!, currency)}`
    : min
      ? `от ${formatPrice(min, currency)}`
      : max
        ? `до ${formatPrice(max!, currency)}`
        : null;

  if (!salary) return null;
  return <Text size='xl'>{salary}</Text>;
};
