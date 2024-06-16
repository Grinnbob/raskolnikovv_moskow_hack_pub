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
import { Vacancy } from 'src/vacancy/vacancy.model';

interface VacancyComplaintCreateAttrs {
  userId: number;
  vacancyId: number;
  description?: string;
}

@Table({ tableName: 'vacancy_complaints' })
export class VacancyComplaints extends Model<
  VacancyComplaints,
  VacancyComplaintCreateAttrs
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
    example: 'Some vacancy complaint information',
    description: 'Vacancy complaint description',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;
}
