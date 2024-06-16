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
import { Role } from 'src/roles/roles.model';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { VacancyLikes } from 'src/vacancy/vacancy-likes.model';
import { VacancyViews } from 'src/vacancy/vacancy-views.model';
import { VacancyResponds } from 'src/vacancy/vacancy-responds.model';
import { Resume } from 'src/resume/resume.model';
import { ResumeLikes } from 'src/resume/resume-likes.model';
import { ResumeViews } from 'src/resume/resume-views.model';
import { ResumeResponds } from 'src/resume/resume-responds.model';
import { Contact } from 'src/contacts/contacts.model';
import { Company } from 'src/company/company.model';
import { CompanyRatings } from 'src/company/company-rating.model';
import { CompanyOwners } from 'src/company/company-owners.model';
import { FinanceAccount } from 'src/financeAccounts/financeAccounts.model';
import { Charge } from 'src/charges/charges.model';
import { VacancyComplaints } from 'src/vacancy/vacancy-complaints.model';
import { VacancyComments } from 'src/vacancy/vacancy-comments.model';
import { ResumeComments } from 'src/resume/resume-comments.model';
import { ResumeComplaints } from 'src/resume/resume-complaints.model';
import { ResumeCommentLikes } from 'src/resume/resume-comment-likes.model';
import { VacancyCommentLikes } from 'src/vacancy/vacancy-comment-likes.model';

export enum UserGender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
}

export enum UserStatus { 
  NOT_LOOKING_OFFERS = 'NOT_LOOKING_OFFERS',
  CONSIDERING_OFFERS = 'CONSIDERING_OFFERS',
  ACTIVELY_CONSIDERING_OFFERS = 'ACTIVELY_CONSIDERING_OFFERS',
  HAVE_AN_OFFER = 'HAVE_AN_OFFER',
  WORKING = 'WORKING',
}

export const MASKED_PASSWORD = '********';
export const MASKED_VERIFICATION_CODE = '*****';

interface UserCreateAttrs {
  email: string;
  password: string;
  roleId: number;
  status?: UserStatus;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  location?: string | null;
  gender?: UserGender | null;
  birthDate?: Date | null;
  emailValidated?: boolean;
  emailValidationCode?: string | null;
  emailValidationCodeSentAt?: Date | null;
  contactId?: number;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreateAttrs> {
  @ApiProperty({ example: '1', description: 'Unique ID' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'user@gmail.com', description: 'User email' })
  @Column({
    type: DataType.STRING,
    unique: false, 
    allowNull: false,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @ApiProperty({ example: '12345', description: 'User password hash' })
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @ApiProperty({ example: 'Grigoriy', description: 'User name' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName?: string | null;

  @ApiProperty({ example: 'Ivanov', description: 'User lastname' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  lastName?: string | null;

  @ApiProperty({ example: '+7 999 000 88 77', description: 'User phone' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone?: string | null; 

  @ApiProperty({ example: 'Moscow', description: 'User location' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location?: string | null;

  @ApiProperty({ example: UserGender.MALE, description: 'User gender' })
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(UserGender),
  })
  gender?: UserGender | null;

  @ApiProperty({ example: 'male', description: 'User birthday' })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  birthDate?: Date | null;

  @ApiProperty({ example: false, description: 'Email validation' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  emailValidated: boolean;

  @ApiProperty({ example: '1234', description: 'Email validation code' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  emailValidationCode?: string | null;

  @ApiProperty({
    example: new Date(),
    description: 'Email validation timestamp',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  emailValidationCodeSentAt?: Date | null;

  @ApiProperty({ example: false, description: 'phone validation' })
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  phoneValidated: boolean;

  @ApiProperty({ example: '1234abcd', description: 'phone validation code' })
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phoneValidationCode?: string | null;

  @ApiProperty({
    example: new Date(),
    description: 'phone validation timestamp',
  })
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  phoneValidationCodeSentAt?: Date | null;

  @ApiProperty({ example: false, description: 'Is user banned' })
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

  @ApiProperty({
    example: UserStatus.ACTIVELY_CONSIDERING_OFFERS,
    description: 'User status',
  })
  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(UserStatus),
  })
  status?: UserStatus;

  @ForeignKey(() => Role)
  @Column({ type: DataType.INTEGER })
  roleId: number;

  @BelongsTo(() => Role)
  role: Role;

  @HasMany(() => Vacancy)
  vacancies: Vacancy[];

  @HasMany(() => Resume)
  resume: Resume[];

  @BelongsToMany(() => Vacancy, () => VacancyLikes)
  vacanciesLiked: Vacancy[];

  @BelongsToMany(() => Vacancy, () => VacancyViews)
  vacanciesViewed: Vacancy[];

  @BelongsToMany(() => Vacancy, () => VacancyResponds)
  vacanciesResponded: Vacancy[];

  @BelongsToMany(() => Vacancy, () => VacancyComplaints)
  vacanciesComplainted: Vacancy[];

  @HasMany(() => VacancyComments)
  vacanciesCommented: VacancyComments[];

  @BelongsToMany(() => VacancyComments, () => VacancyCommentLikes)
  vacancyCommentsLiked: VacancyComments[];

  @BelongsToMany(() => Resume, () => ResumeLikes)
  resumeLiked: Resume[];

  @BelongsToMany(() => Resume, () => ResumeViews)
  resumeViewed: Resume[];

  @BelongsToMany(() => Resume, () => ResumeResponds)
  resumeResponded: Resume[];

  @BelongsToMany(() => Resume, () => ResumeComplaints)
  resumeComplainted: Resume[];

  @HasMany(() => ResumeComments)
  resumeCommented: ResumeComments[];

  @BelongsToMany(() => ResumeComments, () => ResumeCommentLikes)
  resumeCommentsLiked: ResumeComments[];

  @HasOne(() => Contact)
  contact: Contact;

  @BelongsToMany(() => Company, () => CompanyRatings)
  companiesRated: Company[];

  @BelongsToMany(() => Company, () => CompanyOwners)
  ownedCompanies: Company[];

  @ForeignKey(() => FinanceAccount)
  @Column({ type: DataType.INTEGER })
  financeAccountId: number;

  @BelongsTo(() => FinanceAccount)
  financeAccount: FinanceAccount;

  @HasMany(() => Charge)
  charges: Charge[];
}
