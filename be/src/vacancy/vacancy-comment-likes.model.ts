import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';
import { VacancyComments } from './vacancy-comments.model';

interface VacancyCommentLikeCreateAttrs {
  userId: number;
  commentId: number;
}

@Table({ tableName: 'vacancy_comment_likes' })
export class VacancyCommentLikes extends Model<
  VacancyCommentLikes,
  VacancyCommentLikeCreateAttrs
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

  @ForeignKey(() => VacancyComments)
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
