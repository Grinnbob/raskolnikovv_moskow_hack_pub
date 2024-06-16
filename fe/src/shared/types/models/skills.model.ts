import { SkillLevel } from '../enums/skill';

export interface SkillModel {
  id: number;
  title: string;
  description?: string;
  imageName?: string;

  ResumeSkill?: {
    level?: SkillLevel;
  };

  VacancySkill?: {
    level?: SkillLevel;
  };
}
