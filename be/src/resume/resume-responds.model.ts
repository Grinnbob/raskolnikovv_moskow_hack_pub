import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { Resume } from './resume.model';

interface ResumeRespondCreateAttrs {
  userId: number;
  resumeId: number;
}

@Table({ tableName: 'resume_responds' })
export class ResumeResponds extends Model<
  ResumeResponds,
  ResumeRespondCreateAttrs
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

  @ForeignKey(() => Resume)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  resumeId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isViewed: boolean;
}
