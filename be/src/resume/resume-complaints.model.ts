import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { Resume } from 'src/resume/resume.model';

interface ResumeComplaintCreateAttrs {
  userId: number;
  resumeId: number;
  description?: string;
}

@Table({ tableName: 'resume_complaints' })
export class ResumeComplaints extends Model<
  ResumeComplaints,
  ResumeComplaintCreateAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ForeignKey(() => Resume)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  resumeId: number;

  @BelongsTo(() => Resume)
  resume: Resume;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isViewed: boolean;

  @ApiProperty({
    example: 'Some resume complaint information',
    description: 'Resume complaint description',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;
}
