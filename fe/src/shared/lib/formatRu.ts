import { format, formatRelative } from 'date-fns';
import { ru } from 'date-fns/locale';

export const enum EDateFormat {
  hoursMinutes = 'HH:mm',
  dayMounth = 'd MMMM',
  fullDate = 'yyyy-MM-dd в HH:mm:ss',
}

export const resolveDate = (rawDate: string | Date) =>
  typeof rawDate === 'string' ? new Date(rawDate) : rawDate;

export const formatRU = (
  date: string | Date,
  dateFormat: EDateFormat = EDateFormat.hoursMinutes,
) => {
  return format(resolveDate(date), dateFormat, { locale: ru });
};

const removeTimeRegexp = /в (\d{1,2}:\d{2})/;

export const formatRelativeDate = (
  date: string | Date,
  baseDate: string | Date,
  excludeTime?: boolean,
) => {
  const formatted = formatRelative(resolveDate(date), resolveDate(baseDate), {
    locale: ru,
    weekStartsOn: 1,
  });
  if (excludeTime) {
    return formatted?.replace(
      removeTimeRegexp,
      `, ${formatRU(date, EDateFormat.dayMounth)}`,
    );
  }
  return formatted;
};
