import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from 'src/company/company.model';
import { Education } from 'src/education/education.model';
import { EducationOrganization } from 'src/educationOrganization/educationOrganization.model';
import { Resume } from 'src/resume/resume.model';
import { RolesService } from 'src/roles/roles.service';
import { WorkExperience } from 'src/workExperience/workExperience.model';
import { AddInfoToUserDto } from './dto/add-info-to-user.dto';
import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {
  MASKED_PASSWORD,
  MASKED_VERIFICATION_CODE,
  User,
  UserStatus,
} from './users.model';
import {
  PaginatedResponse,
  UserReactionWithDocument,
  UserReactionsCounts,
  ValidationResponse,
} from 'src/utils/interfaces';
import { getInfoPagination, paginate } from 'src/utils/utils';
import { QueryTypes } from 'sequelize';
import { Contact } from 'src/contacts/contacts.model';
import { Role, Roles } from 'src/roles/roles.model';
import moment from 'moment';
import { FinanceAccount } from 'src/financeAccounts/financeAccounts.model';
import { FinanceAccountsService } from 'src/financeAccounts/financeAccounts.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userRepository: typeof User,
    private readonly roleService: RolesService,
    private readonly financeAccountsService: FinanceAccountsService,
  ) {}

  public async create(dto: CreateUserDto): Promise<User> {
    const role = await this.roleService.getByValue(dto.role);
    if (!role) throw new HttpException('Role not found', HttpStatus.NOT_FOUND);

    let status: UserStatus;
    if (role.value === Roles.candidate)
      status = UserStatus.ACTIVELY_CONSIDERING_OFFERS;

    let user = await this.userRepository.create({
      email: dto.email,
      password: dto.password,
      roleId: role.id,
      status,
    });

    if (role.value === Roles.recruiter) {
      const financeAccountId = (
        await this.financeAccountsService.create({ amount: 0 })
      ).id;
      user.$add('financeAccount', financeAccountId);
      user.financeAccountId = financeAccountId;
    }

    user = user.dataValues;
    user.password = MASKED_PASSWORD;
    user.role = role;
    return user;
  }

  public async updatePassword(userId: number, password: string): Promise<User> {
    const result = await this.userRepository.update(
      { password },
      { where: { id: userId }, returning: true },
    );

    const user = result[1][0];
    user.password = MASKED_PASSWORD;
    user.emailValidationCode = user.emailValidationCode
      ? MASKED_VERIFICATION_CODE
      : null;

    return user;
  }

  public async updateEmail(userId: number, email: string): Promise<User> {
    const result = await this.userRepository.update(
      {
        email,
        emailValidated: false,
        emailValidationCode: null,
        emailValidationCodeSentAt: null,
      },
      { where: { id: userId }, returning: true },
    );

    const user = result[1][0];
    user.password = MASKED_PASSWORD;
    user.emailValidationCode = user.emailValidationCode
      ? MASKED_VERIFICATION_CODE
      : null;

    return user;
  }

  public async updateEmailValidationInfo(
    userId: number,
    emailValidated: boolean,
    emailValidationCode?: string,
  ): Promise<User> {
    let emailValidationCodeSentAt: Date;
    if (emailValidationCode) emailValidationCodeSentAt = new Date();

    const result = await this.userRepository.update(
      { emailValidated, emailValidationCode, emailValidationCodeSentAt },
      { where: { id: userId }, returning: true },
    );

    return result[1][0];
  }

  public async checkEmailValidationCode(
    userId: number,
    emailValidationCode?: string,
  ): Promise<ValidationResponse> {
    try {
      const user = await this.getById(userId);
      if (user.emailValidationCode !== emailValidationCode) {
        return {
          success: false,
          error: 'Wrong verification code',
          errorCode: 1,
        };
      }
      if (!user.emailValidationCodeSentAt) {
        return {
          success: false,
          error: 'Empty verification date',
          errorCode: 3,
        };
      }
      if (
        moment(new Date()).diff(user.emailValidationCodeSentAt, 'minute') >= 10
      ) {
        return {
          success: false,
          error: 'Verification code expired',
          errorCode: 2,
        };
      }

      await this.userRepository.update(
        { emailValidated: true },
        { where: { id: userId } },
      );

      return { success: true };
    } catch (e) {
      throw new HttpException(
        `Can't check email validation code: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async addMainInfo(
    userId: string,
    dto: AddInfoToUserDto,
  ): Promise<User> {
    const result = await this.userRepository.update(dto, {
      where: { id: userId },
      returning: true,
    });
    return result[1][0];
  }

  
  public async getById(id: number): Promise<User> {
    return this.userRepository.findByPk(id, {
      include: [
        { model: Role },
        {
          model: FinanceAccount,
          
        },
      ],
    });
  }

  public async getAll(): Promise<User[]> {
    const users = await this.userRepository.findAll({
      include: [{ model: Role }],
    });
    return users.map((user) => {
      user.password = MASKED_PASSWORD;
      user.emailValidationCode = user.emailValidationCode
        ? MASKED_VERIFICATION_CODE
        : null;
      return user;
    });
  }

  public async getBanned(): Promise<User[]> {
    const users = await this.userRepository.findAll({
      where: { isBanned: true },
    });

    return users.map((user) => {
      user.password = MASKED_PASSWORD;
      user.emailValidationCode = user.emailValidationCode
        ? MASKED_VERIFICATION_CODE
        : null;
      return user;
    });
  }

  public async getByEmailAndRoleWithPassword(
    email: string,
    role?: string,
  ): Promise<User> {
    if (!role) {
      const users = await this.userRepository.findAll({
        where: { email },
        include: [{ all: true }],
      });

      if (users && users.length > 1)
        throw new UnauthorizedException({
          message: `User with email ${email} has multiple roles, provide exact one`,
        });
      return users[0];
    }

    return this.userRepository.findOne({
      where: { email },
      include: [{ all: true }, { model: Role, where: { value: role } }],
    });
  }

  public async getAllByEmail(email: string): Promise<User[]> {
    return this.userRepository.findAll({
      where: { email },
    });
  }

  public async getMe(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      include: [
        { all: true },
        {
          model: Resume,
          as: 'resume',
          include: [
            {
              model: Education,
              include: [{ model: EducationOrganization }],
            },
            {
              model: WorkExperience,
              include: [{ model: Company }],
            },
          ],
        },
        {
          model: Contact,
        },
      ],
    });
    user.password = MASKED_PASSWORD;
    user.emailValidationCode = user.emailValidationCode
      ? MASKED_VERIFICATION_CODE
      : null;
    return user;
  }

  public async getPaginatedUsersReactionsWithData(
    userId: number,
    model: 'vacancies' | 'resume',
    submodel:
      | 'vacancy_likes'
      | 'vacancy_views'
      | 'vacancy_responds'
      | 'resume_likes'
      | 'resume_views'
      | 'resume_responds',
    page: number,
    pageSize: number,
  ): Promise<PaginatedResponse<UserReactionWithDocument>> {
    if (
      (model === 'vacancies' &&
        submodel === ('resume_likes' || 'resume_views' || 'resume_responds')) ||
      (model === 'resume' &&
        submodel === ('vacancy_likes' || 'vacancy_views' || 'vacancy_responds'))
    ) {
      throw new HttpException(
        `Wrong data model provided: model = ${model}, submodel = ${submodel}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    const pagination = paginate(page, pageSize);
    const documentIdName = model === 'vacancies' ? 'vacancyId' : 'resumeId';
    const mainQueryConditions = `
      FROM Users as u
      INNER JOIN "${submodel}" as reactions ON reactions."userId" = u.id
      INNER JOIN ${model} as d on d.id = reactions."${documentIdName}" 
      where d.id in 
      (SELECT reactions."${documentIdName}" FROM ${model} as dd
      INNER JOIN Users as uu ON dd."userId" = uu.id
      WHERE uu.id = ${userId})
      AND u.id != ${userId}
    `;

    const result: UserReactionWithDocument[] =
      await this.userRepository.sequelize.query(
        `
        SELECT u.id as "user.id", u.email as "user.email", 
        u."firstName" as "user.firstName", u."lastName" as "user.lastName", 
        u."roleId" as "user.roleId",
        d.id as "document.id", d.title as "document.title", 
        reactions."updatedAt" as "updatedAt"
        ` +
          mainQueryConditions +
          `
        ORDER BY reactions."updatedAt" DESC
        LIMIT ${pagination.limit} OFFSET ${pagination.offset};
    `,
        {
          nest: true,
          plain: false,
          type: QueryTypes.SELECT,
        },
      );

    const [data]: { count: string }[] =
      await this.userRepository.sequelize.query(
        `SELECT count(u.id)` + mainQueryConditions,
        {
          type: QueryTypes.SELECT,
        },
      );

    return {
      results: result.map((userWithDoc) => {
        userWithDoc.user.password = MASKED_PASSWORD;
        userWithDoc.user.emailValidationCode = userWithDoc.user
          .emailValidationCode
          ? MASKED_VERIFICATION_CODE
          : null;
        return userWithDoc;
      }),
      ...getInfoPagination(page, pageSize, data?.count),
    };
  }

  public async getUsersReactionsCounts(
    userId: number,
    model: 'vacancies' | 'resume',
  ): Promise<UserReactionsCounts> {
    const documentIdName = model === 'vacancies' ? 'vacancyId' : 'resumeId';

    const likesQueryConditions = `
      FROM Users as u
      INNER JOIN "${model}_likes" as reactions ON reactions."userId" = u.id
      INNER JOIN ${model} as d on d.id = reactions."${documentIdName}" 
      where d.id in 
      (SELECT reactions."${documentIdName}" FROM ${model} as dd
      INNER JOIN Users as uu ON dd."userId" = uu.id
      WHERE uu.id = ${userId})
      AND u.id != ${userId}
      AND reactions."isViewed" = 'false'
    `;

    const [likes]: { count: string }[] =
      await this.userRepository.sequelize.query(
        `SELECT count(u.id)` + likesQueryConditions,
        {
          type: QueryTypes.SELECT,
        },
      );

    const respondsQueryConditions = `
      FROM Users as u
      INNER JOIN "${model}_responds" as reactions ON reactions."userId" = u.id
      INNER JOIN ${model} as d on d.id = reactions."${documentIdName}" 
      where d.id in 
      (SELECT reactions."${documentIdName}" FROM ${model} as dd
      INNER JOIN Users as uu ON dd."userId" = uu.id
      WHERE uu.id = ${userId})
      AND u.id != ${userId}
      AND reactions."isViewed" = 'false'
    `;

    const [responds]: { count: string }[] =
      await this.userRepository.sequelize.query(
        `SELECT count(u.id)` + respondsQueryConditions,
        {
          type: QueryTypes.SELECT,
        },
      );

    
    
    
    
    
    
    
    
    
    
    

    return {
      likes: parseInt(likes?.count),
      responds: parseInt(responds?.count),
    };
  }

  public async addRole(dto: AddRoleDto): Promise<AddRoleDto> {
    
    
    
    const user = await this.userRepository.findByPk(dto.userId);
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);

    const role = await this.roleService.getByValue(dto.value);
    if (!role) throw new HttpException('Role not found', HttpStatus.NOT_FOUND);

    await user.$add('role', role.id); 
    return dto;
  }

  public async updateStatus(userId: number, status: UserStatus) {
    const result = await this.userRepository.update(
      { status },
      { where: { id: userId }, returning: true },
    );
    const user = result[1][0];
    user.password = MASKED_PASSWORD;
    user.emailValidationCode = user.emailValidationCode
      ? MASKED_VERIFICATION_CODE
      : null;
    return user;
  }

  public async changeIsBanned(
    userId: number,
    isBanned: boolean,
    banReason?: string,
  ): Promise<User> {
    let banDate: Date;
    if (isBanned) {
      banDate = new Date();
    }
    const result = await this.userRepository.update(
      { isBanned, banReason, banDate },
      { where: { id: userId }, returning: true },
    );

    const user = result[1][0];
    user.password = MASKED_PASSWORD;
    user.emailValidationCode = user.emailValidationCode
      ? MASKED_VERIFICATION_CODE
      : null;

    return user;
  }
}
