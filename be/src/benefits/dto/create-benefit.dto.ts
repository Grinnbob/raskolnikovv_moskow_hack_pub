import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateBenefitDto {
  @ApiProperty({ example: 'Free parking', description: 'Benefit title' })
  @IsString({ message: 'Must be string' })
  readonly title: string;

  @ApiProperty({
    example: 'Free parking in 1km from job at working days',
    description: 'Benefit description',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    example: 'folder_id_uuid.ext',
    description: 'Image name',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly imageName?: string;
}
