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
import { Vacancy } from 'src/vacancy/vacancy.model';
import { VacancyCommentLikes } from './vacancy-comment-likes.model';

interface VacancyCommentCreateAttrs {
  userId: number;
  vacancyId: number;
  message: string;
}

@Table({ tableName: 'vacancy_comments' })
export class VacancyComments extends Model<
  VacancyComments,
  VacancyCommentCreateAttrs
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

  @ForeignKey(() => Vacancy)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  vacancyId: number;

  @BelongsTo(() => Vacancy)
  vacancy: Vacancy;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isViewed: boolean;

  @ApiProperty({
    example: 'Some vacancy comment message',
    description: 'Vacancy comment message',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  message: string;

  @BelongsToMany(() => User, () => VacancyCommentLikes)
  likes: User[];
}
