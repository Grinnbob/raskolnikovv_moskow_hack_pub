import moment from 'moment';
import {
  array,
  nativeEnum,
  number,
  object,
  string,
  TypeOf,
  any,
  literal,
  boolean,
  preprocess,
  or,
  union,
  nullable,
  coerce,
} from 'zod';
import {
  EducationOrganizationType,
  EducationType,
} from '../types/enums/education';
import { customErrorMap, dateSchema } from '../lib/schemaValidationUtils';
import { errorMessagesMap } from './languageMappers';
import { CompanyModel, CompanySize } from '../types/models/company.model';
import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from './config';

import {
  CheckVariant,
  Currency,
  DriveLicense,
  QualificationLevel,
  TeamLeadTemper,
  TeamMethodology,
  TeamSize,
  JobType,
  WorkLocationType,
} from '../types/enums/resume-vacancy';

const educationSchema = object({
  educations: array(
    object({
      itemId: number().optional(), // not 'id' because f*cking react-hool-form reserved 'type' and 'id' fields
      qualificationName: string()
        .min(1, 'Введите название специализации')
        .max(100, 'Попробуйте сократить, пожалейте работодателей!'),
      qualificationType: nativeEnum(EducationType, {
        errorMap: customErrorMap(),
      }),
      startDate: dateSchema(
        undefined,
        undefined,
        new Date('2024-01-01'),
        'Похоже, вы из будущего, свяжитесь с нами!',
      ),
      endDate: dateSchema(
        undefined,
        undefined,
        new Date('2024-01-01'),
        'Похоже, вы из будущего, свяжитесь с нами!',
      ),
      diplomaNumber: string()
        .max(100, 'Уверены, что вводите нужное значение? Должно быть короче!')
        .optional()
        .nullable(),
      educationOrganizationId: number().optional(),
      educationOrganization: object({
        id: number().optional(),
        name: string().max(
          100,
          'Похоже, что у Вас слишком длинное название организации',
        ),
        shortName: string()
          .max(
            20,
            'Похоже, что у Вас слишком длинное короткое название организации',
          )
          .optional()
          .nullable(),
        educationOrganizationType: nativeEnum(EducationOrganizationType, {
          errorMap: customErrorMap(),
        }).optional(), // not 'type' because f*cking react-hool-form reserved 'type' and 'id' fields
      }).optional(),
    }).refine(
      (data: any) =>
        data.startDate && data.endDate
          ? moment(data.startDate).isSameOrBefore(moment(data.endDate))
          : true,
      {
        path: ['endDate'],
        message: 'Вы не можете начать раньше, чем закончить!',
      },
    ),
  ),
});

export type IEducation = TypeOf<typeof educationSchema>;

const workExperienceSchema = object({
  workExperiences: array(
    object({
      itemId: number().optional(), // not 'id' because f*cking react-hool-form reserved 'type' and 'id' fields
      jobTitle: string()
        .min(1, 'Введите название должности')
        .max(100, 'Попробуйте сократить, пожалейте работодателей!'),
      location: string()
        .max(100, 'Попробуйте сократить, пожалейте работодателей!')
        .optional()
        .nullable(),
      description: string()
        .max(1000, 'Попробуйте сократить, пожалейте работодателей!')
        .optional()
        .nullable(),
      teamInfluence: string()
        .max(1000, 'Попробуйте сократить, пожалейте работодателей!')
        .optional()
        .nullable(),
      myInfluence: string()
        .max(1000, 'Попробуйте сократить, пожалейте работодателей!')
        .optional()
        .nullable(),
      startDate: dateSchema(
        undefined,
        undefined,
        new Date('2024-01-01'),
        'Похоже, вы из будущего, свяжитесь с нами!',
      ),
      endDate: dateSchema(
        undefined,
        undefined,
        new Date('2024-01-01'),
        'Похоже, вы из будущего, свяжитесь с нами!',
      ),
      qualificationLevel: nativeEnum(QualificationLevel, {
        required_error: errorMessagesMap.requiredField,
        invalid_type_error: errorMessagesMap.mustBeAEnum,
      })
        .optional()
        .nullable(),
      company: object({
        id: number().optional(),
        name: string().max(
          32,
          'Похоже, что у Вас слишком длинное название компании',
        ),
        description: string().max(10000).optional().nullable(),
        website: string().max(100).optional().nullable(),
      }).optional(),
    }).refine(
      (data) =>
        data.startDate && data.endDate
          ? moment(data.startDate).isSameOrBefore(moment(data.endDate))
          : true,
      {
        path: ['endDate'],
        message: 'Вы не можете начать раньше, чем закончить!',
      },
    ),
  ),
});

export type IWorkExperience = TypeOf<typeof workExperienceSchema>;

const companyOwnerSchema = object({
  companyTitle: any(),
  userTitle: any(),
});

export type ICompanyOwner = TypeOf<typeof companyOwnerSchema>;

export const imageValidation = object({
  image: any()
    .optional()
    .nullable()
    .refine(
      (file) => !file?.[0] || file[0].size <= MAX_FILE_SIZE_BYTES,
      `Максимальный размер изображения 25 MB`,
    )
    .refine(
      (file) => !file?.[0] || ACCEPTED_IMAGE_TYPES.includes(file[0].type),
      `Только такие форматы изображений поддерживаются: ${ACCEPTED_IMAGE_TYPES.map(
        (type) => type.replace('image/', ''),
      ).join(', ')}`,
    ),
});

export const companySchema = imageValidation
  .extend({
    id: number().optional(),
    name: string()
      .min(1, 'Введите название компании')
      .max(32, 'Похоже, что у Вас слишком длинное название компании'),
    description: string().max(10000).optional().nullable(),
    website: string()
      .url('Введите корректный сайт! Пример: https://www.example.com')
      .max(100)
      .optional()
      .nullable()
      .or(literal(''))
      .transform((item) => (item === '' ? null : item)),
    status: string().max(100).optional().nullable(),
    isStartup: boolean().optional(),
    address: string().max(1000).optional().nullable(),
    INN: preprocess(
      (item) => JSON.stringify(item).replace(/\D/g, ''),
      union([
        string().length(10, 'Должно быть 10и-значное число'),
        string().length(0),
      ])
        .optional()
        .nullable(),
    ),
    KPP: preprocess(
      (item) => JSON.stringify(item).replace(/\D/g, ''),
      union([
        string().length(9, 'Должно быть 9-значное число'),
        string().length(0),
      ])
        .optional()
        .nullable(),
    ),
    OGRN: preprocess(
      (item) => JSON.stringify(item).replace(/\D/g, ''),
      union([
        string().length(13, 'Должно быть 13и-значное число'),
        string().length(0),
      ])
        .optional()
        .nullable(),
    ),
    companySize: nativeEnum(CompanySize, {
      required_error: errorMessagesMap.requiredField,
      invalid_type_error: errorMessagesMap.mustBeAEnum,
    })
      .optional()
      .nullable(),
    industries: array(
      object({
        itemId: number().optional(),
        title: string({
          required_error: errorMessagesMap.requiredField,
          invalid_type_error: errorMessagesMap.mustBeAString,
        }).max(100),
        description: string().max(100).optional().nullable(),
        image: string().max(1000).optional().nullable(),
      }),
    ),
    imageName: any().optional().nullable(),
  })
  .refine((data) => {
    data.image = data?.image?.[0];
    return true;
  });

export type ICompany = TypeOf<typeof companySchema>;

const skillSchema = object({
  skills: array(
    object({
      itemId: number().optional(), // not 'id' because f*cking react-hool-form reserved 'type' and 'id' fields
      title: string({
        required_error: errorMessagesMap.requiredField,
        invalid_type_error: errorMessagesMap.mustBeAString,
      }).max(100),
      level: any()
        // nativeEnum(SkillLevel, {
        //     errorMap: customErrorMap(),
        // })
        .optional()
        .nullable(),
      description: string().max(100).optional().nullable(),
      image: string().max(1000).optional().nullable(),
    }),
  ),
});

export type ISkills = TypeOf<typeof skillSchema>;

export const vacancySchema = object({
  id: number().optional(),

  сompanyId: number(),
  contactId: number(),

  workExperienceYearsMin: coerce.number().optional(),
  workExperienceYearsMax: coerce.number().optional(),
  title: string()
    .min(1, 'Введите название должности')
    .max(32, 'Похоже, что у Вас слишком длинная должность, опишите часть ниже'),
  qualificationLevel: nativeEnum(QualificationLevel, {
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeAEnum,
  })
    .optional()
    .nullable(),
  description: string()
    .max(100000, 'Что-то много текста, кандидаты замучаются читать, пощадите!')
    .optional()
    .nullable(),
  requirements: string()
    .max(100000, 'Что-то много текста, кандидаты замучаются читать, пощадите!')
    .optional()
    .nullable(),
  responsibilities: string()
    .max(100000, 'Что-то много текста, кандидаты замучаются читать, пощадите!')
    .optional()
    .nullable(),
  conditions: string()
    .max(100000, 'Что-то много текста, кандидаты замучаются читать, пощадите!')
    .optional()
    .nullable(),
  salaryCurrency: nativeEnum(Currency, {
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeAEnum,
  })
    .optional()
    .nullable(),
  salaryMin: coerce
    .number({
      required_error: errorMessagesMap.requiredField,
      invalid_type_error: errorMessagesMap.mustBeANumber,
    })
    .optional()
    .nullable(),
  salaryMax: coerce
    .number({
      required_error: errorMessagesMap.requiredField,
      invalid_type_error: errorMessagesMap.mustBeANumber,
    })
    .optional()
    .nullable(),
  teamLeadTemper: nativeEnum(TeamLeadTemper, {
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeAEnum,
  })
    .optional()
    .nullable(),
  teamMethodology: nativeEnum(TeamMethodology, {
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeAEnum,
  })
    .optional()
    .nullable(),
  teamSize: nativeEnum(TeamSize, {
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeAEnum,
  })
    .optional()
    .nullable(),

  isMain: boolean(),
  isActive: boolean().optional(),
  isRemote: boolean().optional(),
  isSelfEmployed: boolean().optional(),
  isPartTime: boolean().optional(),
  isAllowedWithDisability: boolean().optional().nullable(),
  isFlexibleSchedule: boolean().optional(),
  isShiftWork: boolean().optional(),
  isRatationalWork: boolean().optional(),
  isDeferredMobilization: boolean().optional(),
  isTemporary: boolean().optional(),
  isSeasonal: boolean().optional(),
  isInternship: boolean().optional(),
  isVolonteering: boolean().optional(),
  isReadyForBusinessTrip: boolean().optional(),
  isForStudents: boolean().optional().nullable(),
  isForPensioners: boolean().optional().nullable(),
  isForYoung: boolean().optional().nullable(),

  citizenships: array(
    object({
      title: string({
        required_error: errorMessagesMap.requiredField,
        invalid_type_error: errorMessagesMap.mustBeAString,
      }).max(100),
      imageName: any(),
    }),
  ),
  educationTypes: array(
    nativeEnum(EducationType, {
      required_error: errorMessagesMap.requiredField,
      invalid_type_error: errorMessagesMap.mustBeAEnum,
    }),
  )
    .optional()
    .nullable(),
  driveLicenses: array(
    nativeEnum(DriveLicense, {
      required_error: errorMessagesMap.requiredField,
      invalid_type_error: errorMessagesMap.mustBeAEnum,
    }),
    object({
      id: number().optional().nullable(),
    }),
  )
    .optional()
    .nullable(),
  jobType: nativeEnum(JobType, {
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeAEnum,
  })
    .optional()
    .nullable(),
  workLocationType: nativeEnum(WorkLocationType, {
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeAEnum,
  })
    .optional()
    .nullable(),
  disadvantagedGroups: any(),
  // array(
  //     nativeEnum(DisadvantagedGroups, {
  //         required_error: errorMessagesMap.requiredField,
  //         invalid_type_error: errorMessagesMap.mustBeAEnum,
  //     })
  // )
  //     .optional()
  //     .nullable(),

  benefits: array(
    object({
      title: string({
        required_error: errorMessagesMap.requiredField,
        invalid_type_error: errorMessagesMap.mustBeAString,
      }).max(100),
      description: string().max(100).optional().nullable(),
      imageName: any(),
    }),
  ),
  languages: array(
    object({
      id: number().optional(),
      title: string({
        required_error: errorMessagesMap.requiredField,
        invalid_type_error: errorMessagesMap.mustBeAString,
      }).max(100),
      description: string().max(100).optional().nullable(),
      imageName: any(),
      LanguageVacancy: object({
        level: any(),
        proficiency: any(),
      })
        .optional()
        .nullable(),
    }),
  ),
  category: object({
    id: number().optional(),
    title: string()
      .min(1, 'Выбирете категорию')
      .max(32, 'Похоже, что у Вас слишком длинная категория'),
    description: string().max(10000).optional().nullable(),
    parentId: number().optional().nullable(),
  }).optional(),
  categoryId: number().optional().nullable(),
  city: object({
    id: number().optional().nullable(),
    name: string()
      .max(32, 'Похоже, что у Вас слишком длинный город...')
      .optional()
      .nullable(),
  }).optional(),
  cityId: number().optional().nullable(),
  image: any()
    .optional()
    .nullable()
    .refine(
      (file) => !file?.[0] || file[0].size <= MAX_FILE_SIZE_BYTES,
      `Максимальный размер изображения 25 MB`,
    )
    .refine(
      (file) => !file?.[0] || ACCEPTED_IMAGE_TYPES.includes(file[0].type),
      `Только такие форматы изображений поддерживаются: ${ACCEPTED_IMAGE_TYPES.map(
        (type) => type.replace('image/', ''),
      ).join(', ')}`,
    ),
  imageName: any().optional().nullable(),
})
  .refine((data) => !data.salaryMin || data.salaryMin >= 0, {
    path: ['salaryMin'],
    message: 'Нельзя отнимать деньги у сотрудников!',
  })
  .refine((data) => !data.salaryMax || data.salaryMax >= 0, {
    path: ['salaryMax'],
    message: 'Нельзя отнимать деньги у сотрудников!',
  })
  .refine(
    (data) =>
      data.salaryMin && data.salaryMax
        ? data.salaryMax >= data.salaryMin
        : true,
    {
      path: ['salaryMax'],
      message: 'Вы не можете указать значение меньше, чем минимальное!',
    },
  )
  .refine(
    (data) => (!data.salaryMin && !data.salaryMax) || data.salaryCurrency,
    {
      path: ['salaryCurrency'],
      message: 'Платить баранками пока нельзя!',
    },
  )
  .refine(
    (data) =>
      data.workLocationType === WorkLocationType.REMOTE || data.city?.name,
    {
      path: ['city.name'],
      message: 'Если работа не удалённая, укажите город!',
    },
  )
  .refine((data) => {
    data.image = data?.image?.[0];
    return true;
  });

export type IVacancy = TypeOf<typeof vacancySchema>;

const resumeSchema = object({
  id: number().optional(),
  title: string()
    .min(1, 'Введите название должности')
    .max(32, 'Похоже, что у Вас слишком длинная должность, опишите часть ниже'),
  description: string()
    .max(
      100000,
      'Что-то много текста, работодатели замучаются читать, пощадите!',
    )
    .optional()
    .nullable(),
  qualificationLevel: nativeEnum(QualificationLevel, {
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeAEnum,
  })
    .optional()
    .nullable(),
  salaryCurrency: nativeEnum(Currency, {
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeAEnum,
  })
    .optional()
    .nullable(),
  salaryMin: number({
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeANumber,
  })
    .optional()
    .nullable(),
  salaryMax: number({
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeANumber,
  })
    .optional()
    .nullable(),
  teamLeadTemper: nativeEnum(TeamLeadTemper, {
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeAEnum,
  })
    .optional()
    .nullable(),
  teamMethodology: nativeEnum(TeamMethodology, {
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeAEnum,
  })
    .optional()
    .nullable(),
  teamSize: nativeEnum(TeamSize, {
    required_error: errorMessagesMap.requiredField,
    invalid_type_error: errorMessagesMap.mustBeAEnum,
  })
    .optional()
    .nullable(),

  isActive: boolean(),
  isRemote: boolean().optional(),
  isPartTime: boolean().optional(),
  isAllowedWithDisability: boolean().optional().nullable(),
  isFlexibleSchedule: boolean().optional(),
  isShiftWork: boolean().optional(),
  isRatationalWork: boolean().optional(),
  isDeferredMobilization: boolean().optional(),
  isTemporary: boolean().optional(),
  isSeasonal: boolean().optional(),
  isInternship: boolean().optional(),
  isVolonteering: boolean().optional(),
  isReadyForBusinessTrip: boolean().optional(),

  driveLicenses: any(),

  category: object({
    id: number().optional(),
    title: string()
      .min(1, 'Выбирете категорию')
      .max(32, 'Похоже, что у Вас слишком длинная категория'),
    description: string().max(10000).optional().nullable(),
    parentId: number().optional().nullable(),
  }).optional(),
  categoryId: number().optional(),
  city: object({
    id: number().optional().nullable(),
    name: string()
      .max(32, 'Похоже, что у Вас слишком длинный город...')
      .optional()
      .nullable(),
  }).optional(),
  cityId: number().optional().nullable(),
  languages: array(
    object({
      itemId: number().optional(),
      title: string({
        required_error: errorMessagesMap.requiredField,
        invalid_type_error: errorMessagesMap.mustBeAString,
      }).max(100),
      description: string().max(100).optional().nullable(),
      imageName: any(),
      LanguageResume: object({
        level: any(),
        proficiency: any(),
      })
        .optional()
        .nullable(),
    }),
  ),
  industries: array(
    object({
      itemId: number().optional(),
      title: string({
        required_error: errorMessagesMap.requiredField,
        invalid_type_error: errorMessagesMap.mustBeAString,
      }).max(100),
      description: string().max(100).optional().nullable(),
      imageName: any(),
    }),
  ),
  image: any()
    .optional()
    .nullable()
    .refine(
      (file) => !file?.[0] || file[0].size <= MAX_FILE_SIZE_BYTES,
      `Максимальный размер изображения 25 MB`,
    )
    .refine(
      (file) => !file?.[0] || ACCEPTED_IMAGE_TYPES.includes(file[0].type),
      `Только такие форматы изображений поддерживаются: ${ACCEPTED_IMAGE_TYPES.map(
        (type) => type.replace('image/', ''),
      ).join(', ')}`,
    ),
  imageName: any().optional().nullable(),
})
  .refine((data) => !data.salaryMin || data.salaryMin >= 0, {
    path: ['salaryMin'],
    message: 'Нельзя отнимать деньги у сотрудников!',
  })
  .refine((data) => !data.salaryMax || data.salaryMax >= 0, {
    path: ['salaryMax'],
    message: 'Нельзя отнимать деньги у сотрудников!',
  })
  .refine(
    (data) =>
      data.salaryMin && data.salaryMax
        ? data.salaryMax >= data.salaryMin
        : true,
    {
      path: ['salaryMax'],
      message: 'Вы не можете указать значение меньше, чем минимальное!',
    },
  )
  .refine(
    (data) => (!data.salaryMin && !data.salaryMax) || data.salaryCurrency,
    {
      path: ['salaryCurrency'],
      message: 'Платить баранками пока нельзя!',
    },
  )
  .refine((data) => data.isRemote || data.city?.name, {
    path: ['city.name'],
    message: 'Если работа не удалённая, укажите город!',
  })
  .refine((data) => {
    data.image = data?.image?.[0];
    return true;
  });

export type IResume = TypeOf<typeof resumeSchema>;

export const contactsSchema = object({
  id: number().optional(),
  resumeId: number().optional().nullable(),
  vacancyId: number().optional().nullable(),
  userId: number().optional().nullable(),
  isMain: boolean().optional(),
  email: string()
    .email('Введите корректную почту!')
    .optional()
    .nullable()
    .or(literal(''))
    .transform((item) => (item === '' ? null : item)),
  secondEmail: string()
    .email('Введите корректную почту!')
    .optional()
    .nullable()
    .or(literal(''))
    .transform((item) => (item === '' ? null : item)),
  phone: string().max(20, 'Слишком много символов для телефона!').optional(),
  secondPhone: string()
    .max(20, 'Слишком много символов для телефона!')
    .optional(),
  vk: string()
    .max(40)
    .optional()
    .refine(
      (item) => !item || item?.includes('vk') || item.includes('vkontakte'),
      { message: 'Введите корректный вконтакте!' },
    ),
  telegram: string()
    .max(40)
    .optional()
    .refine(
      (item) => !item || item?.includes('tg') || item.includes('telegram'),
      { message: 'Введите корректный телеграм!' },
    ),
  facebook: string()
    .max(40)
    .optional()
    .refine(
      (item) => !item || item?.includes('fb') || item.includes('facebook'),
      { message: 'Введите корректный facebook!' },
    ),
  linkedin: string()
    .max(40)
    .optional()
    .refine((item) => !item || item.includes('linkedin'), {
      message: 'Введите корректный linkedin!',
    }),
  instagram: string()
    .max(40)
    .optional()
    .refine((item) => !item || item?.includes('inst'), {
      message: 'Введите корректный instagram!',
    }),
  slack: string()
    .max(40)
    .optional()
    .refine((item) => !item || item?.includes('slack'), {
      message: 'Введите корректный slack!',
    }),
  other: string().max(40).optional(),
})
  .refine(
    (data) =>
      data.email ||
      data.secondEmail ||
      data.phone ||
      data.secondPhone ||
      data.vk ||
      data.telegram ||
      data.facebook ||
      data.linkedin ||
      data.instagram ||
      data.slack ||
      data.other,
    {
      path: ['email'],
      message: 'Укажите хотя бы один любой способ связи!',
    },
  )
  .refine(
    (data) =>
      !data.phone ||
      (data.phone &&
        Array.from(data.phone).length > 10 &&
        data.phone &&
        Array.from(data.phone).length < 20),
    {
      path: ['phone'],
      message: 'Введите корректный номер!',
    },
  )
  .refine(
    (data) =>
      !data.phone ||
      (data.phone &&
        Array.from(data.phone).length > 1 &&
        (Array.from(data.phone)[0] === '8' ||
          Array.from(data.phone)[0] + Array.from(data.phone)[1] === '+7')),
    {
      path: ['phone'],
      message: 'Номер должен начинаться с 8 или +7',
    },
  )
  .refine(
    (data) =>
      !data.secondPhone ||
      !data.phone ||
      (data.phone &&
        Array.from(data.phone).length > 10 &&
        data.phone &&
        Array.from(data.phone).length < 20),
    {
      path: ['secondPhone'],
      message: 'Введите корректный номер!',
    },
  )
  .refine(
    (data) =>
      !data.secondPhone ||
      (data.secondPhone &&
        Array.from(data.secondPhone).length > 1 &&
        (Array.from(data.secondPhone)[0] === '8' ||
          Array.from(data.secondPhone)[0] + Array.from(data.secondPhone)[1] ===
            '+7')),
    {
      path: ['secondPhone'],
      message: 'Номер должен начинаться с 8 или +7',
    },
  );

export type IContacts = TypeOf<typeof contactsSchema>;
