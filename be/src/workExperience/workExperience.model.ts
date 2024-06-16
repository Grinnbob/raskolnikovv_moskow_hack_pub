import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Company } from 'src/company/company.model';
import { Resume } from 'src/resume/resume.model';

interface WorkExperienceCreateAttrs {
  jobTitle: string;
  location?: string;
  description?: string;
  teamInfluence?: string;
  myInfluence?: string;
  startDate?: Date | null;
  endDate?: Date | null;
  isVerified?: boolean;
  companyId?: number;
  resumeId: number;
}

@Table({ tableName: 'workExperiences' })
export class WorkExperience extends Model<
  WorkExperience,
  WorkExperienceCreateAttrs
> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Chief Executive Officer', description: 'Job title' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  jobTitle: string;

  @ApiProperty({ example: 'Moscow', description: 'Job location' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location?: string; 

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @ApiProperty({
    example: 'Started two new products',
    description: 'team influence',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  teamInfluence?: string;

  @ApiProperty({
    example: 'Developed mobile app',
    description: 'my influence',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  myInfluence?: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate?: Date | null;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  endDate?: Date | null;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified: boolean;

  @ForeignKey(() => Resume)
  @Column({ type: DataType.INTEGER })
  resumeId: number;

  @BelongsTo(() => Resume)
  resume: Resume;

  @ForeignKey(() => Company)
  @Column({ type: DataType.INTEGER })
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;
}
