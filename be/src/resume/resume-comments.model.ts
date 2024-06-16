import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { Resume } from 'src/resume/resume.model';
import { ResumeCommentLikes } from './resume-comment-likes.model';

interface ResumeCommentCreateAttrs {
  userId: number;
  resumeId: number;
  message: string;
}

@Table({ tableName: 'resume_comments' })
export class ResumeComments extends Model<
  ResumeComments,
  ResumeCommentCreateAttrs
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
    example: 'Some resume comment message',
    description: 'Resume comment message',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @BelongsToMany(() => User, () => ResumeCommentLikes)
  likes: User[];
}
