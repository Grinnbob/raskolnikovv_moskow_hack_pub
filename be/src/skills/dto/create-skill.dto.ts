import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { SkillLevel } from '../resume-skill.model';

export class CreateSkillDto {
  @ApiProperty({
    example: 123,
    description: 'Skill id',
  })
  @IsNumber()
  @IsOptional()
  readonly id?: number;

  @ApiProperty({
    example: 'Java',
    description: 'Skill title',
  })
  @IsString({ message: 'Must be string' })
  readonly title: string;

  @ApiProperty({
    example: 'Java programming language',
    description: 'Skill description',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    example: SkillLevel.MIDDLE,
    description: 'Skill Level',
  })
  @IsOptional()
  readonly level?: SkillLevel;

  @ApiProperty({
    example: 'folder_id_uuid.ext',
    description: 'Image name',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly imageName?: string;
}
