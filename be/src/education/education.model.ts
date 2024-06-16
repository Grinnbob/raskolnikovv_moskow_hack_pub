import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { EducationOrganization } from 'src/educationOrganization/educationOrganization.model';
import { Resume } from 'src/resume/resume.model';

export enum EducationType {
  TRAINING = 'TRAINING', 
  PRE_MIDDLE = 'PRE_MIDDLE', 
  MIDDLE = 'MIDDLE', 
  PRE_HIGHT = 'PRE_HIGHT', 
  SPECIALIST = 'SPECIALIST', 
  BACHELOR = 'BACHELOR', 
  MASTER = 'MASTER', 
  PRE_PHD = 'PRE_PHD', 
  PHD = 'PHD', 
}

interface EducationCreateAttrs {
  qualificationName: string;
  qualificationType: EducationType;
  startDate?: Date | null;
  endDate?: Date | null;
  diplomaNumber?: string;
  isVerified?: boolean;
  resumeId: number;
  educationOrganizationId: number;
}

@Table({ tableName: 'educations' })
export class Education extends Model<Education, EducationCreateAttrs> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  qualificationName: string;

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(EducationType),
  })
  qualificationType: EducationType;

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
    type: DataType.STRING,
    allowNull: true,
  })
  diplomaNumber?: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified?: boolean;

  @ForeignKey(() => Resume)
  @Column({ type: DataType.INTEGER })
  resumeId: number;

  @BelongsTo(() => Resume)
  resume: Resume;

  @ForeignKey(() => EducationOrganization)
  @Column({ type: DataType.INTEGER })
  educationOrganizationId: number;

  @BelongsTo(() => EducationOrganization)
  educationOrganization: EducationOrganization;
}
