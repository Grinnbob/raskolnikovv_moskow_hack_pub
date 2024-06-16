import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateIndustryDto {
  @ApiProperty({ example: 1, description: 'Industry id' })
  @IsNumber()
  @IsOptional()
  readonly id?: number;

  @ApiProperty({ example: 'Devops', description: 'Industry title' })
  @IsString({ message: 'Must be string' })
  readonly title: string;

  @ApiProperty({
    example: 'Some industry info',
    description: 'Industry description',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    example: '-',
    description: 'Industry image',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly image?: string;
}
