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
import { Contact } from 'src/contacts/contacts.model';
import { Education } from 'src/education/education.model';
import { Skill } from 'src/skills/skill.model';
import { User } from 'src/users/users.model';
import {
  DriveLicense,
  Currency,
  TeamLeadTemper,
  TeamMethodology,
  TeamSize,
} from 'src/utils/interfaces';
import { WorkExperience } from 'src/workExperience/workExperience.model';
import { ResumeLikes } from './resume-likes.model';
import { ResumeResponds } from './resume-responds.model';
import { ResumeViews } from './resume-views.model';
import { Category } from 'src/category/category.model';
import { Industry } from 'src/industry/industry.model';
import { IndustryResume } from 'src/industry/industry-resume.model';
import { City } from 'src/city/city.model';
import { ResumeSkill } from 'src/skills/resume-skill.model';
import { LanguageResume } from 'src/language/language-resume.model';
import { Language } from 'src/language/language.model';
import { CitizenshipResume } from 'src/citizenship/citizenship-resume.model';
import { Citizenship } from 'src/citizenship/citizenship.model';
import { ResumeComplaints } from './resume-complaints.model';
import { ResumeComments } from './resume-comments.model';
import { ResumeViewLimit } from 'src/limits/resumeViewLimits.model';

interface ResumeCreateAttrs {
  userId: number;
  title: string;
  description?: string;
  imageName?: string;
  isActive?: boolean;

  cityId?: number;
  categoryId: number;

  salaryCurrency?: Currency;
  salaryMin?: number;
  salaryMax?: number;

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
}

@Table({ tableName: 'resume' })
export class Resume extends Model<Resume, ResumeCreateAttrs> {
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
    description: 'Resume title',
  })
  @Column({
    type: DataType.STRING,
    unique: false,
    allowNull: false,
  })
  title: string;

  @ApiProperty({
    example: 'Some resume information',
    description: 'Resume description',
  })
  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @ApiProperty({
    example: true,
    description: 'Is resume active?',
  })
  @Column({
    type: DataType.BOOLEAN,
    unique: false,
    allowNull: false,
    defaultValue: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: Currency.USD,
    description: 'Resume salary currency',
  })
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(Currency),
  })
  salaryCurrency?: Currency;

  @ApiProperty({
    example: 4000,
    description: 'Resume salary minimum',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  salaryMin?: number;

  @ApiProperty({
    example: 4500,
    description: 'Resume salary maximum',
  })
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  salaryMax?: number;

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
    description: 'Prefered team size',
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
    description: 'Is prefered remote job',
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isRemote: boolean;

  @ApiProperty({
    example: true,
    description: 'Is prefered part time job',
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
    description: 'Is temporary job', 
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isTemporary: boolean;

  @ApiProperty({
    example: true,
    description: 'Is seasonal job', 
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isSeasonal: boolean;

  @ApiProperty({
    example: true,
    description: 'Is internship job', 
  })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isInternship: boolean;

  @ApiProperty({
    example: true,
    description: 'Is ready for volonteering',
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
    example: [DriveLicense.A, DriveLicense.C],
    description: 'Drive license',
  })
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    
    allowNull: true,
  })
  driveLicenses?: DriveLicense[];

  @ApiProperty({ example: false, description: 'Is resume banned' })
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

  @HasMany(() => Education)
  education: Education[];

  @HasMany(() => WorkExperience)
  workExperience: WorkExperience[];

  @BelongsToMany(() => Skill, () => ResumeSkill)
  skills: Skill[];

  @BelongsToMany(() => User, () => ResumeLikes)
  likes: User[];

  @BelongsToMany(() => User, () => ResumeResponds)
  responds: User[];

  @BelongsToMany(() => User, () => ResumeViews)
  views: User[];

  @BelongsToMany(() => User, () => ResumeComplaints)
  complaints: User[];

  @HasMany(() => ResumeComments)
  comments: ResumeComments[];

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

  @BelongsToMany(() => Industry, () => IndustryResume)
  industries: Industry[];

  @ForeignKey(() => City)
  @Column({ type: DataType.INTEGER })
  cityId: number;

  @BelongsTo(() => City)
  city: City;

  @BelongsToMany(() => Language, () => LanguageResume)
  languages: Language[];

  @BelongsToMany(() => Citizenship, () => CitizenshipResume)
  citizenships: Citizenship[];

  @HasMany(() => ResumeViewLimit)
  resumeViewLimits: ResumeViewLimit[];
}
