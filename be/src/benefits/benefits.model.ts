import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { VacancyBenefit } from './vacancy-benefits.model';

interface BenefitCreateAttrs {
  title: string;
  description?: string;
  imageName?: string;
}

@Table({ tableName: 'benefits' })
export class Benefit extends Model<Benefit, BenefitCreateAttrs> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Free parking', description: 'Benefit title' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  title: string;

  @ApiProperty({
    example: 'Free parking in 1km from job at working days',
    description: 'Benefit description',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @ApiProperty({
    example: 'folder_id_uuid.ext',
    description: 'Image name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageName?: string;

  @BelongsToMany(() => Vacancy, () => VacancyBenefit)
  vacancies: Vacancy[];
}
