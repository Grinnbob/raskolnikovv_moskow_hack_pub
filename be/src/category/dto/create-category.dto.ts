import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 1, description: 'Category id' })
  @IsNumber()
  @IsOptional()
  readonly id?: number;

  @ApiProperty({ example: 'Devops', description: 'Category title' })
  @IsString({ message: 'Must be string' })
  readonly title: string;

  @ApiProperty({
    example: 'Some category info',
    description: 'Category description',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({ example: 1, description: 'Parent category id' })
  @IsNumber()
  @IsOptional()
  readonly parentId?: number;
}
