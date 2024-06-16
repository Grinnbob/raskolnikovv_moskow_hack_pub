import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { EducationOrganizationType } from 'src/educationOrganization/educationOrganization.model';
import { EducationType } from '../education.model';
import { CreateEducationOrganizationDto } from 'src/educationOrganization/dto/create-educationOrganization.dto';

export class CreateEducationDto {
  @ApiProperty({
    example: 123,
    description: 'Ed id',
  })
  @IsNumber()
  @IsOptional()
  readonly id?: number;

  @ApiProperty({
    example: 'Master degree of physics',
    description: 'qualification name',
  })
  @IsString({ message: 'Must be string' })
  readonly qualificationName: string;

  @ApiProperty({
    example: EducationType.MASTER,
    description: 'qualification type',
  })
  readonly qualificationType: EducationType;

  @ApiProperty({
    description: 'Education Organization id',
  })
  @IsNumber()
  @IsOptional()
  readonly educationOrganizationId?: number;

  @ApiProperty({
    example: { name: 'MIT' },
    description: 'Education Organization',
  })
  @IsObject()
  @IsOptional()
  readonly educationOrganization?: CreateEducationOrganizationDto;

  @ApiProperty({
    example: EducationOrganizationType.UNIVERSITY,
    description: 'Education Organization type',
  })
  @IsOptional()
  readonly educationOrganizationType: EducationOrganizationType;

  @ApiProperty({ example: new Date(), description: 'start date' })
  @IsDateString()
  @IsOptional()
  readonly startDate?: Date | null;

  @ApiProperty({ example: new Date(), description: 'end date' })
  @IsDateString()
  @IsOptional()
  readonly endDate?: Date | null;

  @ApiProperty({ example: '1234 567890', description: 'diploma number' })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly diplomaNumber?: string;

  @ApiProperty({ example: false, description: 'Is education verified?' })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isVerified?: boolean;
}
