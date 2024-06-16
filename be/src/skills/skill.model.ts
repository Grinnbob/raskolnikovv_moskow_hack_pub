import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Resume } from 'src/resume/resume.model';
import { ResumeSkill } from './resume-skill.model';
import { VacancySkill } from './vacancy-skill.model';
import { Vacancy } from 'src/vacancy/vacancy.model';

interface SkillCreateAttrs {
  title: string;
  description?: string;
  imageName?: string;
  parentId?: number;
}

@Table({ tableName: 'skills' })
export class Skill extends Model<Skill, SkillCreateAttrs> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'JS', description: 'Skill title' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  title: string;

  @ApiProperty({
    example: 'JavaScript programming language',
    description: 'Skill description',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @ApiProperty({
    example: 'folder_id_uuid.ext',
    description: 'Image name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageName?: string;

  @BelongsToMany(() => Resume, () => ResumeSkill)
  resume: Resume[];

  @BelongsToMany(() => Vacancy, () => VacancySkill)
  vacancies: Vacancy[];

  @HasMany(() => Skill)
  subskills: Skill[];

  @ForeignKey(() => Skill)
  @Column({ type: DataType.INTEGER })
  parentId?: number;
}
