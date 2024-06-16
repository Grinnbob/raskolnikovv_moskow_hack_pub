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
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { CreateCitizenshipDto } from 'src/citizenship/dto/create-citizenship.dto';
import { CreateCityDto } from 'src/city/dto/create-city.dto';
import { CreateIndustryDto } from 'src/industry/dto/create-industry.dto';
import { CreateLanguageDto } from 'src/language/dto/create-language.dto';
import {
  DriveLicense,
  Currency,
  TeamLeadTemper,
  TeamMethodology,
  TeamSize,
} from 'src/utils/interfaces';

export class CreateResumeDto {
  @ApiProperty({
    example: 1,
    description: 'Resume id',
    type: Number,
  })
  @IsNumber()
  @Min(1)
  @IsOptional()
  readonly id?: number;

  @ApiProperty({
    example: 'Web designer in Cool corp ',
    description: 'Resume title',
  })
  @IsString({ message: 'Must be string' })
  readonly title: string;

  @ApiProperty({
    example: 'Some resume info',
    description: 'Resume description',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly description?: string;

  @ApiProperty({
    example: true,
    description: 'Is resume active?',
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isActive?: boolean;

  @ApiProperty({
    example: Currency.USD,
    description: 'Resume salary currency',
  })
  @IsEnum(Currency)
  @IsOptional()
  readonly salaryCurrency?: Currency;

  @ApiProperty({
    example: 4000,
    description: 'Resume salary minimum',
    type: Number,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  readonly salaryMin?: number;

  @ApiProperty({
    example: 4500,
    description: 'Resume salary maximum',
    type: Number,
  })
  @IsNumber()
  @IsOptional()
  readonly salaryMax?: number;

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
    example: 'folder_id_uuid.ext',
    description: 'Image name',
  })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly imageName?: string;

  @ApiProperty({
    example: true,
    description: 'Is resume remote',
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isRemote?: boolean;

  @ApiProperty({
    example: true,
    description: 'Is resume part time',
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
    description: 'Is temporary', 
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isTemporary: boolean;

  @ApiProperty({
    example: true,
    description: 'Is seasonal', 
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isSeasonal: boolean;

  @ApiProperty({
    example: true,
    description: 'Is internship', 
  })
  @IsBoolean({ message: 'Must be boolean' })
  @IsOptional()
  readonly isInternship: boolean;

  @ApiProperty({
    example: true,
    description: 'Is volonteering job',
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
    example: [DriveLicense.A, DriveLicense.C],
    description: 'Drive license',
  })
  @IsOptional()
  readonly driveLicenses?: DriveLicense[];

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
    example: [{ title: 'Real estate' }],
    description: 'Industries',
  })
  @IsArray()
  @IsOptional()
  readonly industries?: CreateIndustryDto[];

  @ApiProperty({
    example: [{ title: 'Russian' }],
    description: 'citizenships',
  })
  @IsArray()
  @IsOptional()
  readonly citizenships?: CreateCitizenshipDto[];
}
