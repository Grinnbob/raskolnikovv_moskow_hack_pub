import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { CreateIndustryDto } from 'src/industry/dto/create-industry.dto';
import { CompanySize } from 'src/utils/interfaces';

export class CreateCompanyDto {
  @ApiProperty({ example: 1, description: 'Company id' })
  @IsNumber()
  @IsOptional()
  readonly id?: number;

  @ApiProperty({ example: 'Apple', description: 'Company name' })
  @IsString({ message: 'Must be string 123' })
  readonly name: string;

  @ApiProperty({ example: 'www.apple.com', description: 'Company website' })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  @IsUrl()
  readonly website?: string;

  @ApiProperty({
    example: 'Some company info',
    description: 'Company description',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    example: 'We are vegan-oriented company!',
    description: 'Company status',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly status?: string;

  @ApiProperty({
    example: CompanySize.AVERAGE,
    description: 'Company size',
  })
  @IsOptional()
  readonly companySize?: CompanySize;

  @ApiProperty({
    example: [{ title: 'Real estate' }],
    description: 'Industries',
  })
  @IsArray()
  @IsOptional()
  readonly industries?: CreateIndustryDto[];

  @ApiProperty({
    example: true,
    description: 'Is startup?',
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isStartup?: boolean;

  @ApiProperty({
    example: 'US, London, Baker street, 15',
    description: 'Address',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly address?: string;

  @ApiProperty({ example: '12345', description: 'INN' })
  @IsString({ message: 'Must be string' })
  @MaxLength(10)
  @IsOptional()
  readonly INN?: string;

  @ApiProperty({ example: '12345', description: 'KPP' })
  @IsString({ message: 'Must be string' })
  @MaxLength(10)
  @IsOptional()
  readonly KPP?: string;

  @ApiProperty({ example: '12345', description: 'OGRN' })
  @IsString({ message: 'Must be string' })
  @MaxLength(20)
  @IsOptional()
  readonly OGRN?: string;
}
