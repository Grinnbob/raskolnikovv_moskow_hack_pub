import { ApiProperty } from '@nestjs/swagger';
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  HasOne,
  Model,
  Table,
} from 'sequelize-typescript';
import { Benefit } from 'src/benefits/benefits.model';
import { VacancyBenefit } from 'src/benefits/vacancy-benefits.model';
import { Company } from 'src/company/company.model';
import { Contact } from 'src/contacts/contacts.model';
import { User } from 'src/users/users.model';
import {
  DisadvantagedGroup,
  DriveLicense,
  Currency,
  TeamLeadTemper,
  TeamMethodology,
  TeamSize,
} from 'src/utils/interfaces';
import { VacancyLikes } from './vacancy-likes.model';
import { VacancyResponds } from './vacancy-responds.model';
import { VacancyViews } from './vacancy-views.model';
import { Category } from 'src/category/category.model';
import { City } from 'src/city/city.model';
import { LanguageVacancy } from 'src/language/language-vacancy.model';
import { Language } from 'src/language/language.model';
import { Skill } from 'src/skills/skill.model';
import { VacancySkill } from 'src/skills/vacancy-skill.model';
import { Citizenship } from 'src/citizenship/citizenship.model';
import { CitizenshipVacancy } from 'src/citizenship/citizenship-vacancy.model';
import { VacancyComplaints } from './vacancy-complaints.model';
import { VacancyComments } from './vacancy-comments.model';

interface VacancyCreateAttrs {
  title: string;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  conditions?: string;
  isActive: boolean;
  imageName?: string;
  locationMapLink?: string;

  companyId?: number;
  categoryId: number;
  cityId?: number;

  salaryCurrency?: Currency;
  salaryMin?: number;
  salaryMax?: number;

  workExperienceYearsMin?: number;
  workExperienceYearsMax?: number;

  teamLeadTemper?: TeamLeadTemper;
  teamMethodology?: TeamMethodology;
  teamSize?: TeamSize;
  driveLicenses?: DriveLicense[];

  isRemote?: boolean;
  isPartTime?: boolean;
  isAllowedWithDisability?: boolean;
  isFlexibleSchedule?: boolean;
  isShiftWork?: boolean;
  isRatationalWork?: boolean;
  isDeferredMobilization?: boolean;
  isTemporary?: boolean;
  isSeasonal?: boolean;
  isInternship?: boolean;
  isVolonteering?: boolean;
  isReadyForBusinessTrip?: boolean;
  isForStudents?: boolean;
  isForPensioners?: boolean;
  isForYoung?: boolean;
}

@Table({ tableName: 'vacancies' })
export class Vacancy extends Model<Vacancy, VacancyCreateAttrs> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({
    example: 'Web designer',
    description: 'Vacancy title',
  })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  title: string;

  @ApiProperty({
    example: true,
    description: 'Is vacancy active?',
  })
  @Column({
    type: DataType.BOOLEAN,
    unique: false,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: 'Some vacancy information',
    description: 'Vacancy description',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @ApiProperty({
    example: 'Some vacancy information',
    description: 'Vacancy requirements',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  requirements?: string;

  @ApiProperty({
    example: 'Some vacancy information',
    description: 'Vacancy responsibilities',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  responsibilities?: string;

  @ApiProperty({
    example: 'Some vacancy information',
    description: 'Vacancy conditions',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  conditions?: string;

  @ApiProperty({
    example: Currency.USD,
    description: 'Vacancy salary currency',
  })
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(Currency),
  })
  salaryCurrency?: Currency;

  @ApiProperty({
    example: 4000,
    description: 'Vacancy salary minimum',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  salaryMin?: number;

  @ApiProperty({
    example: 4500,
    description: 'Vacancy salary maximum',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  salaryMax?: number;

  @ApiProperty({
    example: 1,
    description: 'Minimum years of work experience',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  workExperienceYearsMin?: number;

  @ApiProperty({
    example: 6,
    description: 'Maximum years of work experience',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  workExperienceYearsMax?: number;

  @ApiProperty({
    example: TeamLeadTemper.DEMOCRAT,
    description: 'Team lead temper',
  })
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(TeamLeadTemper),
  })
  teamLeadTemper?: TeamLeadTemper;

  @ApiProperty({
    example: TeamMethodology.AGILE,
    description: 'Team methodology',
  })
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(TeamMethodology),
  })
  teamMethodology?: TeamMethodology;

  @ApiProperty({
    example: TeamSize.AVERAGE,
    description: 'Team size',
  })
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(TeamSize),
  })
  teamSize?: TeamSize;

  @ApiProperty({
    example: 'folder_id_uuid.ext',
    description: 'Image name',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageName?: string;

  @ApiProperty({
    example: true,
    description: 'Is vacancy remote',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isRemote: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy part time',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPartTime: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy allowed with disability', 
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    defaultValue: null,
  })
  isAllowedWithDisability: boolean;

  @ApiProperty({
    example: true,
    description: 'Is flexible schedule', 
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isFlexibleSchedule: boolean;

  @ApiProperty({
    example: true,
    description: 'Is shift work', 
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isShiftWork: boolean;

  @ApiProperty({
    example: true,
    description: 'Is ratational work', 
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isRatationalWork: boolean;

  @ApiProperty({
    example: true,
    description: 'Is deferred mobilization', 
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isDeferredMobilization: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy temporary', 
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isTemporary: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy seasonal', 
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isSeasonal: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy internship', 
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isInternship: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy volonteering',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isVolonteering: boolean;

  @ApiProperty({
    example: true,
    description: 'Is ready for business trip',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isReadyForBusinessTrip: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy for students',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isForStudents: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy for pensioners',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isForPensioners: boolean;

  @ApiProperty({
    example: true,
    description: 'Is vacancy for young', 
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  isForYoung: boolean;

  @ApiProperty({
    example: [DriveLicense.A, DriveLicense.C],
    description: 'Drive license',
  })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    
    allowNull: true,
  })
  driveLicenses?: DriveLicense[];

  @ApiProperty({
    example: [DisadvantagedGroup.SINGLE, DisadvantagedGroup.LARGE_FAMILIES],
    description: 'Disadvantaged groups', 
  })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    
    allowNull: true,
  })
  disadvantagedGroups?: DisadvantagedGroup[];

  @ApiProperty({
    example: '-',
    description: 'Work location map link',
  })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  locationMapLink?: string;

  @ApiProperty({ example: false, description: 'Is vacancy banned' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isBanned: boolean;

  @ApiProperty({ example: 'Spam', description: 'Ban reason' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  banReason?: string | null;

  @ApiProperty({
    example: new Date(),
    description: 'Ban timestamp',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  banDate?: Date | null;

  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @BelongsToMany(() => Benefit, () => VacancyBenefit)
  benefits: Benefit[];

  @ForeignKey(() => Company)
  @Column({ type: DataType.INTEGER })
  companyId: number;

  @BelongsTo(() => Company)
  company: Company;

  @BelongsToMany(() => User, () => VacancyLikes)
  likes: User[];

  @BelongsToMany(() => User, () => VacancyResponds)
  responds: User[];

  @BelongsToMany(() => User, () => VacancyViews)
  views: User[];

  @BelongsToMany(() => User, () => VacancyComplaints)
  complaints: User[];

  @HasMany(() => VacancyComments)
  comments: VacancyComments[];

  @ForeignKey(() => Contact)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  contactId?: number;

  @HasOne(() => Contact)
  contact: Contact;

  @ForeignKey(() => Category)
  @Column({ type: DataType.INTEGER })
  categoryId: number;

  @BelongsTo(() => Category)
  category: Category;

  @ForeignKey(() => City)
  @Column({ type: DataType.INTEGER })
  cityId: number;

  @BelongsTo(() => City)
  city: City;

  @BelongsToMany(() => Language, () => LanguageVacancy)
  languages: Language[];

  @BelongsToMany(() => Citizenship, () => CitizenshipVacancy)
  citizenships: Citizenship[];

  @BelongsToMany(() => Skill, () => VacancySkill)
  skills: Skill[];
}
