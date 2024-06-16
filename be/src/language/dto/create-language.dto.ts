import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { SkillLevel } from 'src/skills/resume-skill.model';
import { LanguageProficiency } from '../language-resume.model';

export class CreateLanguageDto {
  @ApiProperty({ example: 1, description: 'Language id' })
  @IsNumber()
  @IsOptional()
  readonly id?: number;

  @ApiProperty({ example: 'English', description: 'Language title' })
  @IsString({ message: 'Must be string' })
  readonly title: string;

  @ApiProperty({
    example: 'Some language info',
    description: 'Language description',
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

  @IsOptional()
  readonly level?: SkillLevel;

  @IsOptional()
  readonly proficiency?: LanguageProficiency;
}
