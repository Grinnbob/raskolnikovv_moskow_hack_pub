import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { Language } from './language.model';
import { SkillLevel } from 'src/skills/resume-skill.model';

enum LanguageProficiency { 
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

interface LanguageVacancyCreateAttrs {
  languageId: number;
  vacancyId: number;
  level?: SkillLevel;
  proficiency?: LanguageProficiency;
}

@Table({ tableName: 'language_vacancies', createdAt: false, updatedAt: false })
export class LanguageVacancy extends Model<
  LanguageVacancy,
  LanguageVacancyCreateAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Language)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  languageId: number;

  @ForeignKey(() => Vacancy)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  vacancyId: number;

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(SkillLevel),
  })
  level?: SkillLevel;

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(LanguageProficiency),
  })
  proficiency?: LanguageProficiency;
}
