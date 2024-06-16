import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { ResumeComments } from './resume-comments.model';

interface ResumeCommentLikeCreateAttrs {
  userId: number;
  commentId: number;
}

@Table({ tableName: 'resume_comment_likes' })
export class ResumeCommentLikes extends Model<
  ResumeCommentLikes,
  ResumeCommentLikeCreateAttrs
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

  @ForeignKey(() => ResumeComments)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  commentId: number;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isViewed: boolean;
}
