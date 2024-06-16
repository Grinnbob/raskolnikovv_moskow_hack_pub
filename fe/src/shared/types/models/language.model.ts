import { LanguageProficiency } from '../enums/language';
import { SkillLevel } from '../enums/skill';

export interface LanguageModel {
  id: number;
  title: string;
  description?: string;
  imageName?: string;

  LanguageResume?: {
    level?: SkillLevel;
    proficiency?: LanguageProficiency;
    isVerified?: boolean;
  };

  LanguageVacancy?: {
    level?: SkillLevel;
    proficiency?: LanguageProficiency;
  };
}
