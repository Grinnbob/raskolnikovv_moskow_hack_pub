import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { Company } from 'src/company/company.model';

export class CreateWorkExperienceDto {
  @ApiProperty({
    example: 123,
    description: 'WE id',
  })
  @IsNumber()
  @IsOptional()
  readonly id?: number;

  @ApiProperty({
    example: 'CEO',
    description: 'job Title',
  })
  @IsString({ message: 'Must be string' })
  readonly jobTitle: string;

  @ApiProperty({
    example: 'Moscow',
    description: 'job location',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly location?: string;

  @ApiProperty({
    example: 'Very good company',
    description: 'WE description',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    example: 'Started two new products',
    description: 'team influence',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly teamInfluence?: string;

  @ApiProperty({
    example: 'Developed mobile app',
    description: 'my influence',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly myInfluence?: string;

  @ApiProperty({ example: new Date(), description: 'start date' })
  @IsDateString()
  @IsOptional()
  readonly startDate?: Date | null;

  @ApiProperty({ example: new Date(), description: 'end date' })
  @IsDateString()
  @IsOptional()
  readonly endDate?: Date | null;

  @ApiProperty({ example: false, description: 'Is work experience verified?' })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isVerified?: boolean;

  @ApiProperty({
    example: 123,
    description: 'Company id',
  })
  @IsNumber()
  @IsOptional()
  readonly companyId?: number;

  @ApiProperty({
    example: { name: 'Amazon inc.' },
    description: 'Company',
  })
  @IsObject()
  @IsOptional()
  readonly company?: Company;
}
