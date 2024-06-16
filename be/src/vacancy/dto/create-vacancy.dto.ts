import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { CreateBenefitDto } from 'src/benefits/dto/create-benefit.dto';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { CreateCitizenshipDto } from 'src/citizenship/dto/create-citizenship.dto';
import { CreateCityDto } from 'src/city/dto/create-city.dto';
import { Company } from 'src/company/company.model';
import { CreateIndustryDto } from 'src/industry/dto/create-industry.dto';
import { CreateLanguageDto } from 'src/language/dto/create-language.dto';
import {
  DriveLicense,
  Currency,
  TeamLeadTemper,
  TeamMethodology,
  TeamSize,
} from 'src/utils/interfaces';

export class CreateVacancyDto {
  @ApiProperty({
    example: 1,
    description: 'Vacancy id',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  @Min(1)
  readonly id?: number;

  @ApiProperty({
    example: 'Web designer in Cool corp ',
    description: 'Vacancy title',
  })
  @IsString({ message: 'Must be string' })
  readonly title: string;

  @ApiProperty({
    example: true,
    description: 'Is vacancy active?',
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isActive?: boolean;

  @ApiProperty({
    example: 'Some vacancy info',
    description: 'Vacancy description',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    example: 'Some vacancy info',
    description: 'Vacancy requirements',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly requirements?: string;

  @ApiProperty({
    example: 'Some vacancy info',
    description: 'Vacancy responsibilities',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly responsibilities?: string;

  @ApiProperty({
    example: 'Some vacancy info',
    description: 'Vacancy conditions',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly conditions?: string;

  @ApiProperty({
    example: Currency.USD,
    description: 'Vacancy salary currency',
  })
  @IsEnum(Currency)
  @IsOptional()
  readonly salaryCurrency?: Currency;

  @ApiProperty({
    example: 4000,
    description: 'Vacancy salary minimum',
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly salaryMin?: number;

  @ApiProperty({
    example: 4500,
    description: 'Vacancy salary maximum',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  readonly salaryMax?: number;

  @ApiProperty({
    example: 1,
    description: 'Minimum years of work experience',
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly workExperienceYearsMin?: number;

  @ApiProperty({
    example: 6,
    description: 'Maximum years of work experience',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  readonly workExperienceYearsMax?: number;

  @ApiProperty({
    example: TeamLeadTemper.DEMOCRAT,
    description: 'Team lead temper',
  })
  @IsOptional()
  readonly teamLeadTemper?: TeamLeadTemper;

  @ApiProperty({
    example: TeamMethodology.AGILE,
    description: 'Team methodology',
  })
  @IsOptional()
  readonly teamMethodology?: TeamMethodology;

  @ApiProperty({
    example: TeamSize.AVERAGE,
    description: 'Team size',
  })
  @IsOptional()
  readonly teamSize?: TeamSize;

  @ApiProperty({
    example: '-',
    description: 'Vacancy image name',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly imageName?: string;

  @ApiProperty({
    example: true,
    description: 'Is vacancy remote',
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isRemote?: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy part time',
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isPartTime?: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy allowed with disability',
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isAllowedWithDisability?: boolean;

  @ApiProperty({
    example: false,
    description: 'Is flexible schedule', 
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isFlexibleSchedule?: boolean;

  @ApiProperty({
    example: false,
    description: 'Is shift work', 
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isShiftWork?: boolean;

  @ApiProperty({
    example: false,
    description: 'Is ratational work', 
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isRatationalWork?: boolean;

  @ApiProperty({
    example: false,
    description: 'Is deferred mobilization', 
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isDeferredMobilization?: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy temporary', 
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isTemporary: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy seasonal', 
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isSeasonal: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy internship', 
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isInternship: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy volonteering',
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isVolonteering: boolean;

  @ApiProperty({
    example: true,
    description: 'Is ready for business trip',
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isReadyForBusinessTrip: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy for students',
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isForStudents: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy for pensioners',
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isForPensioners: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy for young',
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isForYoung: boolean;

  @ApiProperty({
    example: [DriveLicense.A, DriveLicense.C],
    description: 'Drive license',
  })
  @IsOptional()
  readonly driveLicenses?: DriveLicense[];

  @ApiProperty({
    example: { name: 'Amazon inc.' },
    description: 'Company',
  })
  @IsObject()
  @IsOptional()
  readonly company?: Company;

  @ApiProperty({
    example: [{ title: 'Good parking' }],
    description: 'Benefits',
  })
  @IsArray()
  @IsOptional()
  readonly benefits?: CreateBenefitDto[];

  @ApiProperty({
    example: 1,
    description: 'Category id',
  })
  @IsNumber()
  @IsOptional()
  readonly categoryId?: number;

  @ApiProperty({
    example: { title: 'C++' },
    description: 'Category',
  })
  @IsObject()
  @IsOptional()
  readonly category?: CreateCategoryDto;

  @ApiProperty({
    example: [{ title: 'Real estate' }],
    description: 'Industries',
  })
  @IsArray()
  @IsOptional()
  readonly industries?: CreateIndustryDto[];

  @ApiProperty({
    example: { name: 'Moscow' },
    description: 'City',
  })
  @IsObject()
  @IsOptional()
  readonly city?: CreateCityDto;

  @ApiProperty({
    example: [{ title: 'Russian' }],
    description: 'languages',
  })
  @IsArray()
  @IsOptional()
  readonly languages?: CreateLanguageDto[];

  @ApiProperty({
    example: [{ title: 'Russian' }],
    description: 'citizenships',
  })
  @IsArray()
  @IsOptional()
  readonly citizenships?: CreateCitizenshipDto[];
}
