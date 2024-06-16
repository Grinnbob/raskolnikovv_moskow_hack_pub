import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Resume } from 'src/resume/resume.model';
import { Industry } from './industry.model';

interface IndustryResumeteCreateAttrs {
  industryId: number;
  resumeId: number;
}

@Table({ tableName: 'industry_resume', createdAt: false, updatedAt: false })
export class IndustryResume extends Model<
  IndustryResume,
  IndustryResumeteCreateAttrs
> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Industry)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  industryId: number;

  @ForeignKey(() => Resume)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  resumeId: number;
}
