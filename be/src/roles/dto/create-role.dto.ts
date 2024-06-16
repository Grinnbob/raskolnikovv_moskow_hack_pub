import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: 'RECRUITER', description: 'User role' })
  @IsString({ message: 'Must be string' })
  readonly value: string;

  @ApiProperty({ example: 'recruiter', description: 'User role description' })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly description?: string;
}
