import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Education } from 'src/education/education.model';

export enum EducationOrganizationType {
  UNIVERSITY = 'UNIVERSITY',
  HIGH_SCHOOL = 'HIGH_SCHOOL',
  SCHOOL = 'SCHOOL',
  COURSE = 'COURSE',
}

interface EducationOrganizationCreateAttrs {
  name: string;
  shortName?: string;
  description?: string;
  website?: string;
  type?: EducationOrganizationType;
  isVerified?: boolean;
  imageName?: string;
}

@Table({ tableName: 'educationOrganizations' })
export class EducationOrganization extends Model<
  EducationOrganization,
  EducationOrganizationCreateAttrs
> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Moscow Institute of Physics and Technology',
    description: 'Education organization name',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  name: string;

  @ApiProperty({
    example: 'MIPT',
    description: 'Education organization short name',
  })
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true,
  })
  shortName?: string;

  @ApiProperty({
    example: 'Some education organization information',
    description: 'Education organization description',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  description?: string;

  @ApiProperty({
    example: 'www.mipt.ru',
    description: 'Education organization websie',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  website?: string;

  @ApiProperty({
    example: EducationOrganizationType.UNIVERSITY,
    description: 'education organization type',
  })
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(EducationOrganizationType),
  })
  type?: EducationOrganizationType;

  @ApiProperty({
    example: false,
    description: 'Is this education organization exist and do their work?',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVerified: boolean;

  @ApiProperty({
    example: 'folder_id_uuid.ext',
    description: 'Image name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageName?: string;

  @HasMany(() => Education)
  educations: Education[];
}
