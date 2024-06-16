import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { Benefit } from './benefits.model';

@Table({ tableName: 'vacancy_benefits', createdAt: false, updatedAt: false })
export class VacancyBenefit extends Model<VacancyBenefit> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ForeignKey(() => Benefit)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  benefitId: number;

  @ForeignKey(() => Vacancy)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  vacancyId: number;
}
