import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CompanyRatingDto {
  @ApiProperty({ example: 1, description: 'Company id' })
  @IsNumber()
  readonly id: number;

  @ApiProperty({ example: 1, description: 'Company rating' })
  @IsNumber()
  @IsOptional()
  @Max(5)
  @Min(0)
  readonly rating?: number;

  @ApiProperty({ example: 'Very nice company', description: 'Company recall' })
  @IsString()
  @IsOptional()
  readonly recall?: string;
}
