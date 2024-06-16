import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Resume } from 'src/resume/resume.model';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { LanguageResume } from './language-resume.model';
import { LanguageVacancy } from './language-vacancy.model';

interface LanguageCreateAttrs {
  title: string;
  description?: string;
  imageName?: string;
}

@Table({ tableName: 'languages' })
export class Language extends Model<Language, LanguageCreateAttrs> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Devops', description: 'Language title' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  title: string;

  @ApiProperty({
    example: 'Some language information',
    description: 'Language description',
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

  @BelongsToMany(() => Resume, () => LanguageResume)
  resume: Resume[];

  @BelongsToMany(() => Vacancy, () => LanguageVacancy)
  vacancies: Vacancy[];
}
