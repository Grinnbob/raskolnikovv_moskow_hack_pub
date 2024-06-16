import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Resume } from 'src/resume/resume.model';
import { Vacancy } from 'src/vacancy/vacancy.model';

interface CategoryCreateAttrs {
  title: string;
  description?: string;
  parentId?: number;
}

@Table({ tableName: 'categories' })
export class Category extends Model<Category, CategoryCreateAttrs> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Devops', description: 'Category title' })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  title: string;

  @ApiProperty({
    example: 'Some category information',
    description: 'Category description',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @HasMany(() => Resume)
  resume: Resume[];

  @HasMany(() => Vacancy)
  vacancies: Vacancy[];

  @HasMany(() => Category)
  subcategories: Category[];

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER })
  parentId?: number;
}
