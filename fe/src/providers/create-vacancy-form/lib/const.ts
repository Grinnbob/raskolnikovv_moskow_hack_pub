export const vacancyInfoFormFields = [
  'title',
  'description',
  'salaryMin',
  'salaryMax',
  'salaryCurrency',
  'category',
  'qualificationLevel',
  'workExperienceYearsMin',
  'workExperienceYearsMax',
  'responsibilities',
  'requirements',
  'skills',
  'conditions',
  'benefits',
  'jobType',
  'workLocationType',
  'workLocationType',
  'teamSize',
  'teamMethodology',
  'citizenships',
  'educationTypes',
  'languages',
  'driveLicenses',
];

export const vacancyContactFormFields = ['contactId'];

export const stepsFields: Record<number, string[]> = {
  0: vacancyInfoFormFields,
  1: vacancyContactFormFields,
  2: [],
};
