import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { EducationOrganizationType } from '../educationOrganization.model';

export class CreateEducationOrganizationDto {
  @ApiProperty({
    example: 'Moscow Institute of Physics and Technology',
    description: 'Education Organization name',
  })
  @IsString({ message: 'Must be string' })
  readonly name: string;

  @ApiProperty({
    example: 'MIPT',
    description: 'Education Organization short name',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly shortName?: string;

  @ApiProperty({
    example: 'Very good university',
    description: 'Education Organization description',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    example: 'www.mipt.ru',
    description: 'Education Organization website',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly website?: string;

  @ApiProperty({
    example: EducationOrganizationType.UNIVERSITY,
    description: 'Education Organization type',
  })
  readonly type: EducationOrganizationType;

  @ApiProperty({
    example: 'folder_id_uuid.ext',
    description: 'Image name',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly imageName?: string;
}
