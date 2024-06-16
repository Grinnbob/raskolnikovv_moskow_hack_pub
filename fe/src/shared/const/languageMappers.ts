import { CompanySize } from '../types/models/company.model';
import { Roles } from '../types/models/role.model';
import {
  EducationType,
  EducationOrganizationType,
} from '../types/enums/education';
import {
  DisadvantagedGroup,
  DriveLicense,
  Currency,
  TeamLeadTemper,
  TeamMethodology,
  TeamSize,
  QualificationLevel,
  JobType,
  WorkLocationType,
} from '../types/enums/resume-vacancy';
import { SkillLevel } from '../types/enums/skill';
import { UserGender } from '../types/enums/users';
import { LanguageProficiency } from '../types/enums/language';

export type Variants = {
  label: string;
  value: boolean | null;
};

export const educationTypeMap = [
  {
    label: 'Бакалавр',
    value: EducationType.BACHELOR,
  },
  {
    label: 'Магистр',
    value: EducationType.MASTER,
  },
  {
    label: 'Среднее образование',
    value: EducationType.MIDDLE,
  },
  {
    label: 'Доктор наук',
    value: EducationType.PHD,
  },
  {
    label: 'Неоконченное высшее',
    value: EducationType.PRE_HIGHT,
  },
  {
    label: 'Неоконченное среднее',
    value: EducationType.PRE_MIDDLE,
  },
  {
    label: 'Кандидат наук',
    value: EducationType.PRE_PHD,
  },
  {
    label: 'Специалист',
    value: EducationType.SPECIALIST,
  },
  {
    label: 'Курс или тренинг',
    value: EducationType.TRAINING,
  },
  {
    label: 'Не указывать',
    value: null,
  },
];

export const educationOrganizationTypeMap = [
  {
    label: 'Курс или тренинг',
    value: EducationOrganizationType.COURSE,
  },
  {
    label: 'Колледж',
    value: EducationOrganizationType.HIGH_SCHOOL,
  },
  {
    label: 'Школа',
    value: EducationOrganizationType.SCHOOL,
  },
  {
    label: 'ВУЗ',
    value: EducationOrganizationType.UNIVERSITY,
  },
  {
    label: 'Не указывать',
    value: null,
  },
];

export const isActiveMap = [
  {
    label: 'Да',
    value: true,
  },
  {
    label: 'Нет',
    value: false,
  },
];

export const skillLevelMap = [
  {
    label: 'Начальный',
    value: SkillLevel.JUNIOR,
  },
  {
    label: 'Средний',
    value: SkillLevel.MIDDLE,
  },
  {
    label: 'Продвинутый',
    value: SkillLevel.SENIOR,
  },
  {
    label: 'Не указывать',
    value: null,
  },
];

export const qualificationLevelMap = [
  {
    label: 'Стажёр',
    value: QualificationLevel.INTERN,
  },
  {
    label: 'Младший',
    value: QualificationLevel.JUNIOR,
  },
  {
    label: 'Средний',
    value: QualificationLevel.MIDDLE,
  },
  {
    label: 'Старший',
    value: QualificationLevel.SENIOR,
  },
  {
    label: 'Ведущий',
    value: QualificationLevel.LEAD,
  },
];

export const userGenderMap = [
  {
    label: 'Женский',
    value: UserGender.FEMALE,
  },
  {
    label: 'Мужской',
    value: UserGender.MALE,
  },
  {
    label: 'Другой',
    value: UserGender.OTHER,
  },
];

export const userRoleMap = [
  {
    label: 'Кандидат',
    value: Roles.candidate,
  },
  {
    label: 'Рекрутер',
    value: Roles.recruiter,
  },
  {
    label: 'Админ',
    value: Roles.admin,
  },
];

export const teamLeadTemperMap = [
  {
    label: 'Демократичный',
    value: TeamLeadTemper.DEMOCRAT,
  },
  {
    label: 'Требовательный',
    value: TeamLeadTemper.DICTATOR,
  },
  {
    label: 'Хитро-требовательный',
    value: TeamLeadTemper.MANIPULATOR,
  },
  {
    label: 'Организаторский',
    value: TeamLeadTemper.ORGANIZER,
  },
  {
    label: 'Пессимистичный',
    value: TeamLeadTemper.PESSIMIST,
  },
  {
    label: 'Другое',
    value: TeamLeadTemper.OTHER,
  },
];

export const teamMethodologyMap = [
  {
    label: 'Гибкая методология',
    value: TeamMethodology.AGILE,
  },
  {
    label: 'Канбан',
    value: TeamMethodology.KANBAN,
  },
  {
    label: 'Скрам',
    value: TeamMethodology.SCRUM,
  },
  {
    label: 'Вотерфол',
    value: TeamMethodology.WATERFALL,
  },
  {
    label: 'Каждый день',
    value: TeamMethodology.DAY,
  },
  {
    label: 'Раз в неделю',
    value: TeamMethodology.WEEK,
  },
  {
    label: 'Раз в две недели',
    value: TeamMethodology.TWO_WEEKS,
  },
  {
    label: 'Раз в месяц',
    value: TeamMethodology.MONTH,
  },
  {
    label: 'Другое',
    value: TeamMethodology.OTHER,
  },
];

export const teamSizeMap = [
  {
    label: '1-5 человек',
    value: TeamSize.SMALL,
  },
  {
    label: '5-15 человек',
    value: TeamSize.AVERAGE,
  },
  {
    label: '15-30 человек',
    value: TeamSize.BIG,
  },
  {
    label: 'Больше 30 человек',
    value: TeamSize.VERY_BIG,
  },
];

export const companySizeMap = [
  {
    label: '1-10 человек',
    value: CompanySize.SMALL,
  },
  {
    label: '10-100 человек',
    value: CompanySize.AVERAGE,
  },
  {
    label: '100-1000 человек',
    value: CompanySize.BIG,
  },
  {
    label: 'Больше 1000 человек',
    value: CompanySize.VERY_BIG,
  },
];

export const driveLicenseMap = [
  {
    label: 'A - мотоциклы',
    value: DriveLicense.A,
  },
  {
    label: 'B - легковые авто',
    value: DriveLicense.B,
  },
  {
    label: 'C - грузовые авто',
    value: DriveLicense.C,
  },
  {
    label: 'D - автобусы',
    value: DriveLicense.D,
  },
  {
    label: 'E - авто с прицепом',
    value: DriveLicense.E,
  },
];

export const disadvantagedGroupMap = [
  {
    label:
      'Беженцы, лица, получившие временное убежище; вынужденные переселенцы',
    value: DisadvantagedGroup.REFUGEES,
  },
  {
    label: 'Лица, освобождённые из мест лишения свободы',
    value: DisadvantagedGroup.PRISONERS,
  },
  {
    label:
      'Матери и отцы, воспитывающие без супруга (супруги) детей в возрасте до 5 лет',
    value: DisadvantagedGroup.SINGLE,
  },
  {
    label: 'Многодетные семьи',
    value: DisadvantagedGroup.LARGE_FAMILIES,
  },
  {
    label: 'Несовершеннолетние работники',
    value: DisadvantagedGroup.MINORS,
  },
  {
    label: 'Работники, имеющие детей инвалидов',
    value: DisadvantagedGroup.DISABLED_CHILDREN,
  },
  {
    label:
      'Работники, осуществляющие уход за больными членами их семей в соотвтетствии с медицинским заключением',
    value: DisadvantagedGroup.NURSING_CARE,
  },
];

export const jobTypeMap = [
  {
    label: 'Обычная работа',
    value: JobType.FULL,
  },
  {
    label: 'Фриланс',
    value: JobType.FREELANCE,
  },
  {
    label: 'Разовое задание',
    value: JobType.ONE_TIME_TASK,
  },
  {
    label: 'Проектная работа',
    value: JobType.TEMPORARY,
  },
  {
    label: 'Сезонная работа',
    value: JobType.SEASONAL,
  },
];

export const workLocationTypeMap = [
  {
    label: 'Удалёнка',
    value: WorkLocationType.REMOTE,
  },
  {
    label: 'Офис',
    value: WorkLocationType.OFFICE,
  },
  {
    label: 'Гибрид',
    value: WorkLocationType.HYBRID,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const salaryCurrencyMap = Object.values(Currency).map((item) => {
  return {
    label: item,
    value: item,
  };
});

export const errorMessagesMap = {
  requiredField: 'Обязательное поле',
  mustBeANumber: 'Введите число',
  mustBeAString: 'Введите строку',
  mustBeAEnum: 'Выберите один из вариантов',
};

export const isPartTimeVariants: Variants[] = [
  {
    label: 'Частичная занятость',
    value: true,
  },
  {
    label: 'Полная занятость',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isAllowedWithDisabilityVariants: Variants[] = [
  {
    label: 'Доступно для людей с ограничениями',
    value: true,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isFlexibleScheduleVariants: Variants[] = [
  {
    label: 'Гибкий график',
    value: true,
  },
  {
    label: 'Стабильный график',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isShiftWorkVariants: Variants[] = [
  {
    label: 'Работа по сменам',
    value: true,
  },
  {
    label: 'Работа без смен',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isRatationalWorkVariants: Variants[] = [
  {
    label: 'Вахтовая работа',
    value: true,
  },
  {
    label: 'Не вахтовая работа',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isDeferredMobilizationVariants: Variants[] = [
  {
    label: 'Отсрочка от мобилизации',
    value: true,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isStartupVariants: Variants[] = [
  {
    label: 'Cтартап',
    value: true,
  },
  {
    label: 'Не стартап',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isTemporaryVariants: Variants[] = [
  {
    label: 'Проектная работа или разовое задание',
    value: true,
  },
  {
    label: 'Постоянная работа',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isSeasonalVariants: Variants[] = [
  {
    label: 'Сезонная работа',
    value: true,
  },
  {
    label: 'Не сезонная работа',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isInternshipVariants: Variants[] = [
  {
    label: 'Стажировка',
    value: true,
  },
  {
    label: 'Не стажировка',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isVolonteeringVariants: Variants[] = [
  {
    label: 'Волонтёрство',
    value: true,
  },
  {
    label: 'Не волонтёрство',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isReadyForBusinessTripVariants: Variants[] = [
  {
    label: 'Возможность командировок',
    value: true,
  },
  {
    label: 'Без командировок',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isForStudentsVariants: Variants[] = [
  {
    label: 'Для студентов',
    value: true,
  },
  {
    label: 'Не для студентов',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isForPensionersVariants: Variants[] = [
  {
    label: 'Для пенсионеров',
    value: true,
  },
  {
    label: 'Не для пенсионеров',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isForYoungVariants: Variants[] = [
  {
    label: 'Доступно для соискателей с 14 лет',
    value: true,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const isCompanyVerifiedVariants: Variants[] = [
  {
    label: 'Проверенные компании',
    value: true,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const salarySortVariants: Variants[] = [
  {
    label: 'Сначала макс зп',
    value: true,
  },
  {
    label: 'Сначала мин зп',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const workExperienceSortVariants: Variants[] = [
  {
    label: 'Сначала макс опыт',
    value: true,
  },
  {
    label: 'Сначала мин опыт',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const educationSortVariants: Variants[] = [
  {
    label: 'Сначала макс лет обучения',
    value: true,
  },
  {
    label: 'Сначала мин лет обучения',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const likesSortVariants: Variants[] = [
  {
    label: 'Самые популярные',
    value: true,
  },
  {
    label: 'Самые непопулярные',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const viewsSortVariants: Variants[] = [
  {
    label: 'Самые просматриваемые',
    value: true,
  },
  {
    label: 'Самые непросматриваемые',
    value: false,
  },
  {
    label: 'Не важно',
    value: null,
  },
];

export const getWorkExperienceLengthText = (
  workExperienceYears: string,
): string => {
  let result = '';
  const yearsFloat = parseFloat(workExperienceYears);
  if (!yearsFloat || isNaN(yearsFloat)) return workExperienceYears + ' лет';

  const years = Math.floor(yearsFloat);
  const months = Math.ceil((yearsFloat * 12) % 12);

  if (years) {
    result = `${years} `;
    switch (years) {
      case 1:
        result = result + 'год';
        break;
      case 2:
      case 3:
      case 4:
        result = result + 'года';
        break;
      default:
        result = result + 'лет';
        break;
    }
  }

  if (months) {
    result = result + ` ${months} `;
    switch (months) {
      case 1:
        result = result + 'месяц';
        break;
      case 2:
      case 3:
      case 4:
        result = result + 'месяца';
        break;
      default:
        result = result + 'месяцев';
        break;
    }
  }

  return result;
};

export const getCompanyVacancyText = (
  vacanciesCount?: string | number,
): string => {
  const result = vacanciesCount + ' вакансий';
  if (!vacanciesCount) return '0 вакансий';

  const vacanciesCountInt = Number(vacanciesCount);
  if (!vacanciesCountInt || isNaN(vacanciesCountInt)) return result;

  switch (vacanciesCountInt % 10) {
    case 1:
      return vacanciesCount + ' вакансия';
    case 2:
    case 3:
    case 4:
      return vacanciesCount + ' вакансии';
    default:
      return result;
  }
};

export const getCompanyEmployeeText = (
  emplyeesCount?: string | number,
): string => {
  const result = emplyeesCount + ' сотрудников';
  if (!emplyeesCount) return '0 сотрудников';

  const emplyeesCountInt = Number(emplyeesCount);
  if (!emplyeesCountInt || isNaN(emplyeesCountInt)) return result;

  switch (emplyeesCountInt % 10) {
    case 1:
      return emplyeesCount + ' сотрудник';
    case 2:
    case 3:
    case 4:
      return emplyeesCount + ' сотрудника';
    default:
      return result;
  }
};

export const languageProficiencyVariants = [
  { value: LanguageProficiency.A1, label: 'A1 - Начальный' },
  { value: LanguageProficiency.A2, label: 'A2 - Элементарный' },
  { value: LanguageProficiency.B1, label: 'B1 - Средний' },
  { value: LanguageProficiency.B2, label: 'B2 - Выше среднего' },
  { value: LanguageProficiency.C1, label: 'C1 - Продвинутый' },
  { value: LanguageProficiency.C2, label: 'C2 - Верхний' },
];

export const publicationMethodsVariants = [
  { value: '1', label: 'Сразу после сохранения' },
  { value: '2', label: 'В заданное время' },
  { value: '3', label: 'Пока не публиковать' },
];
