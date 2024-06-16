import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Resume } from 'src/resume/resume.model';
import { Language } from './language.model';
import { SkillLevel } from 'src/skills/resume-skill.model';

export enum LanguageProficiency { 
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2',
}

interface LanguageResumeteCreateAttrs {
  languageId: number;
  resumeId: number;
  level?: SkillLevel;
  proficiency?: LanguageProficiency;
  isVerified?: boolean;
}

@Table({ tableName: 'language_resume', createdAt: false, updatedAt: false })
export class LanguageResume extends Model<
  LanguageResume,
  LanguageResumeteCreateAttrs
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

  @ForeignKey(() => Resume)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  resumeId: number;

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

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified?: boolean;
}
