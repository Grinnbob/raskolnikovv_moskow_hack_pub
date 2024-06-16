export enum TeamSize {
  SMALL = 'SMALL', // 1-5
  AVERAGE = 'AVERAGE', // 5-15
  BIG = 'BIG', // 15-30
  VERY_BIG = 'VERY_BIG', // >30
}

export enum TeamLeadTemper { // по Джейн Моутон и Роберт Блейк
  DICTATOR = 'DICTATOR',
  DEMOCRAT = 'DEMOCRAT',
  PESSIMIST = 'PESSIMIST',
  MANIPULATOR = 'MANIPULATOR',
  ORGANIZER = 'ORGANIZER',
  OTHER = 'OTHER',
}

export enum TeamMethodology {
  WATERFALL = 'WATERFALL',
  AGILE = 'AGILE',
  SCRUM = 'SCRUM',
  KANBAN = 'KANBAN',
  WEEK = 'WEEK',
  DAY = 'DAY',
  TWO_WEEKS = 'TWO_WEEKS',
  MONTH = 'MONTH',
  OTHER = 'OTHER',
}

export enum Currency {
  RUB = 'RUB', // todo
  USD = 'USD', // $
  EUR = 'EUR', // €
  CNY = 'CNY',
  KZT = 'KZT',
  BYN = 'BYN',
  BTC = 'BTC', // ฿
  JPY = 'JPY', // ¥
  OTHER = 'OTHER',
}

export enum DriveLicense {
  A = 'A', // мотоциклы
  B = 'B', // легковые авто
  C = 'C', // грузовые авто
  D = 'D', // автобусы
  E = 'E', // авто с прицепом
}

export enum DisadvantagedGroup {
  REFUGEES = 'REFUGEES', // беженцы, лица, получившие временное убежище; вынужденные переселенцы
  PRISONERS = 'PRISONERS', // лица, освобождённые из мест лишения свободы
  SINGLE = 'SINGLE', // матери и отцы, воспитывающие без супруга (супруги) детей в возрасте до 5 лет
  LARGE_FAMILIES = 'LARGE_FAMILIES', // многодетные семьи
  MINORS = 'MINORS', // несовершеннолетние работники
  DISABLED_CHILDREN = 'DISABLED_CHILDREN', // работники, имеющие детей инвалидов
  NURSING_CARE = 'NURSING_CARE', // работники, осуществляющие уход за больными членами их семей в соотвтетствии с медицинским заключением
}

export enum QualificationLevel {
  INTERN = 'INTERN',
  JUNIOR = 'JUNIOR',
  MIDDLE = 'MIDDLE',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
}

export enum JobType {
  ONE_TIME_TASK = 'ONE_TIME_TASK',
  FREELANCE = 'FREELANCE',
  TEMPORARY = 'TEMPORARY',
  SEASONAL = 'SEASONAL',
  FULL = 'FULL',
}

export enum WorkLocationType {
  REMOTE = 'REMOTE',
  OFFICE = 'OFFICE',
  HYBRID = 'HYBRID',
}

export type CheckVariant = {
  value: string | number | boolean;
  label: string;
  isChecked: boolean;
};
