import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Resume } from 'src/resume/resume.model';
import { Company } from 'src/company/company.model';
import { IndustryResume } from './industry-resume.model';
import { IndustryCompany } from './industry-company.model';

interface IndustryCreateAttrs {
  title: string;
  description?: string;
  image?: string;
}

@Table({ tableName: 'industries' })
export class Industry extends Model<Industry, IndustryCreateAttrs> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Devops', description: 'Industry title' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  title: string;

  @ApiProperty({
    example: 'Some industry information',
    description: 'Industry description',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @ApiProperty({
    example: '-',
    description: 'Industry image',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  image?: string; 

  @BelongsToMany(() => Resume, () => IndustryResume)
  resume: Resume[];

  @BelongsToMany(() => Company, () => IndustryCompany)
  companies: Company[];
}
