import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { WorkExperience } from 'src/workExperience/workExperience.model';
import { User } from 'src/users/users.model';
import { IndustryCompany } from 'src/industry/industry-company.model';
import { Industry } from 'src/industry/industry.model';
import { CompanySize } from 'src/utils/interfaces';
import { CompanyRatings } from './company-rating.model';
import { CompanyOwners } from './company-owners.model';

interface CompanyCreateAttrs {
  ownerId: number;
  name: string;
  isVerified?: boolean;
  website?: string;
  description?: string;
  status?: string;
  companySize?: CompanySize;
  imageName?: string;
  isStartup?: boolean;
  address?: string;
  INN?: string;
  KPP?: string;
  OGRN?: string;
}

@Table({ tableName: 'companies' })
export class Company extends Model<Company, CompanyCreateAttrs> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Apple', description: 'Company name' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @ApiProperty({ example: 'www.apple.com', description: 'Company websie' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    
    
    
  })
  website?: string;

  @ApiProperty({
    example: 'Some company information',
    description: 'Company description',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @ApiProperty({
    example: 'We are vegan-oriented company!',
    description: 'Company status',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  status?: string;

  @ApiProperty({
    example: CompanySize.AVERAGE,
    description: 'Company size',
  })
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CompanySize),
  })
  companySize?: CompanySize;

  @ApiProperty({
    example: 'folder_id_uuid.ext',
    description: 'Image name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageName?: string;

  @ApiProperty({
    example: true,
    description: 'Is startup?',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isStartup: boolean;

  @ApiProperty({
    example: true,
    description: 'Is verified?',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified?: boolean;

  @ApiProperty({ example: false, description: 'Is vacancy banned' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isBanned: boolean;

  @ApiProperty({ example: 'Spam', description: 'Ban reason' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  banReason?: string | null;

  @ApiProperty({
    example: new Date(),
    description: 'Ban timestamp',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  banDate?: Date | null;

  @ApiProperty({
    example: 'US, London, Baker street, 15',
    description: 'Address',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    
  })
  address?: string;

  @ApiProperty({
    example: 12345,
    description: 'INN',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    
  })
  INN?: string;

  @ApiProperty({
    example: 12345,
    description: 'KPP',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    
  })
  KPP?: string;

  @ApiProperty({
    example: 12345,
    description: 'OGRN',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
    
  })
  OGRN?: string;

  @HasMany(() => WorkExperience)
  workExperiences: WorkExperience[];

  @HasMany(() => Vacancy)
  vacancies: Vacancy[];

  @BelongsToMany(() => Industry, () => IndustryCompany)
  industries: Industry[];

  @BelongsToMany(() => User, () => CompanyRatings)
  ratings: User[];

  @BelongsToMany(() => User, () => CompanyOwners)
  owners: User[];
}
