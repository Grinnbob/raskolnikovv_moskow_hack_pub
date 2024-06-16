import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { BenefitsService } from 'src/benefits/benefits.service';
import { VacancyBenefit } from 'src/benefits/vacancy-benefits.model';
import { Company } from 'src/company/company.model';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { User } from 'src/users/users.model';
import { PaginatedResponse } from 'src/utils/interfaces';
import {
  getInfoPagination,
  getVacancyHtml,
  mapQueryToOrderConditionVacancy,
  mapQueryToWhereConditionVacancy,
  paginate,
} from 'src/utils/utils';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { VacancyLikes } from './vacancy-likes.model';
import { VacancyResponds } from './vacancy-responds.model';
import { VacancyViews } from './vacancy-views.model';
import { Vacancy } from './vacancy.model';
import { Category } from 'src/category/category.model';
import { Sequelize } from 'sequelize-typescript';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { Industry } from 'src/industry/industry.model';
import { City } from 'src/city/city.model';
import { Benefit } from 'src/benefits/benefits.model';
import { CompanyService } from 'src/company/company.service';
import { CategoryService } from 'src/category/category.service';
import { CreateBenefitDto } from 'src/benefits/dto/create-benefit.dto';
import { LanguageService } from 'src/language/language.service';
import { FilesService } from 'src/files/files.service';
import { CitizenshipService } from 'src/citizenship/citizenship.service';
import { CreateSkillDto } from 'src/skills/dto/create-skill.dto';
import { Skill } from 'src/skills/skill.model';
import { SkillService } from 'src/skills/skill.service';
import { Citizenship } from 'src/citizenship/citizenship.model';
import { Language } from 'src/language/language.model';
import { Role, Roles } from 'src/roles/roles.model';
import { UsersService } from 'src/users/users.service';
import { PinoLoggerService } from 'src/logger/logger.service';
import { VacancyComplaints } from './vacancy-complaints.model';
import { VacancyComments } from './vacancy-comments.model';
import { FinanceAccountsService } from 'src/financeAccounts/financeAccounts.service';
import { VacancyCommentLikes } from './vacancy-comment-likes.model';

@Injectable()
export class VacancyService {
  constructor(
    @InjectModel(Vacancy) private readonly vacancyRepository: typeof Vacancy,
    @InjectModel(VacancyBenefit)
    private readonly vacancyBenefitRepository: typeof VacancyBenefit,
    @InjectModel(VacancyLikes)
    private readonly vacancyLikesRepository: typeof VacancyLikes,
    @InjectModel(VacancyViews)
    private readonly vacancyViewsRepository: typeof VacancyViews,
    @InjectModel(VacancyResponds)
    private readonly vacancyRespondsRepository: typeof VacancyResponds,
    @InjectModel(VacancyComplaints)
    private readonly vacancyComplaintsRepository: typeof VacancyComplaints,
    @InjectModel(VacancyComments)
    private readonly vacancyCommentsRepository: typeof VacancyComments,
    @InjectModel(VacancyCommentLikes)
    private readonly vacancyCommentLikesRepository: typeof VacancyCommentLikes,
    private readonly companyService: CompanyService,
    private readonly benefitService: BenefitsService,
    private readonly categoryService: CategoryService,
    private readonly skillService: SkillService,
    private readonly languageService: LanguageService,
    private readonly citizenshipService: CitizenshipService,
    private readonly usersService: UsersService,
    private readonly financeAccountsService: FinanceAccountsService,
    private readonly fileService: FilesService,
    private readonly sequelize: Sequelize,
    private readonly logger: PinoLoggerService,
  ) {
    this.logger.setContext(VacancyService.name);
  }

  async get(id: number): Promise<Vacancy> {
    return this.vacancyRepository.findByPk(id, {
      include: [
        { all: true },
        {
          model: VacancyComments,
          include: [
            { model: User, as: 'user', include: [{ model: Role }] },
            { model: User, as: 'likes' },
          ],
          order: [['createdAt', 'DESC']],
        },
      ],
    });
  }

  async getAllByUserId(userId: number): Promise<Vacancy[]> {
    return this.vacancyRepository.findAll({
      where: { userId },
      include: [{ all: true }],
    });
  }

  async getAllByCompanyId(companyId: number): Promise<Vacancy[]> {
    return this.vacancyRepository.findAll({
      where: { companyId },
      include: [{ all: true }],
    });
  }

  async upsertImage(id: number, image: Express.Multer.File): Promise<Vacancy> {
    const vacancy = await this.vacancyRepository.findByPk(id);
    const oldImageName = vacancy.imageName;
    const imageName = await this.fileService.upsert(
      image,
      'images/vacancy',
      id + '_',
      oldImageName,
    );

    const result = await this.vacancyRepository.update(
      { imageName },
      { where: { id }, returning: true },
    );

    return result[1][0];
  }

  async deleteImage(id: number, imageName?: string): Promise<Vacancy> {
    const vacancy = await this.vacancyRepository.findByPk(id);

    if (imageName) await this.fileService.delete(imageName, 'images/vacancy');
    else {
      await this.fileService.delete(vacancy.imageName, 'images/vacancy');
    }

    
    if (vacancy.imageName === imageName || !imageName) {
      const result = await this.vacancyRepository.update(
        { imageName: null },
        { where: { id }, returning: true },
      );
      return result[1][0];
    }
    return vacancy;
  }

  async upsertCompany(
    userId: number,
    vacancyId: number,
    companyDto: CreateCompanyDto,
  ): Promise<Company> {
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        const vacancy = this.vacancyRepository.findByPk(vacancyId, {
          include: [{ model: Company }],
        });

        if (!vacancy)
          throw new HttpException(
            `Vacancy with id ${vacancyId} doesn't exist!`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );

        const company = await this.companyService.upsert(
          userId,
          companyDto,
          transactionHost,
        );

        await this.vacancyRepository.update(
          { companyId: company.id },
          { where: { id: vacancyId }, ...transactionHost },
        );

        return company;
      });
      return result;
    } catch (e) {
      this.logger.error(`Transaction has been rolled back: ${e}`);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async upsertSkills(
    vacancyId: number,
    skills: CreateSkillDto[],
  ): Promise<Skill[]> {
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const vacancy = await this.vacancyRepository.findByPk(vacancyId);
        return this.skillService.upsertRelations(
          vacancy,
          'vacancy',
          skills,
          transactionHost,
        );
      });
      return result;
    } catch (e) {
      console.log('Transaction has been rolled back: ', e);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async upsert(
    userId: number,
    financeAccountId: number,
    role: Roles,
    dto: CreateVacancyDto,
    type: 'create' | 'update',
  ): Promise<Vacancy> {
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        const vacancy = { ...dto, userId };

        if (type === 'create' && process.env.IS_PAYMENTS_ENABLED) {
          await this.financeAccountsService.chargeForVacancyCreate(
            userId,
            financeAccountId,
            role,
          );
        }

        
        
        
        
        
        const category: CreateCategoryDto = {
          title: dto.category.title,
          description: dto.category.description || null,
          parentId: dto.category.parentId || null,
        };

        
        
        
        
        
        
        

        
        let upsertedCategory: Category;
        if (category.title)
          upsertedCategory = await this.categoryService.findOrCreate(
            category,
            transactionHost,
          );

        const [upsertedVacancy] = await this.vacancyRepository.upsert(
          {
            ...vacancy,
            
            categoryId: upsertedCategory?.id,
          },
          transactionHost,
        );

        
        if (vacancy.benefits?.length) {
          upsertedVacancy.benefits = await this.upsertBenefits(
            upsertedVacancy,
            vacancy.benefits,
            transactionHost,
          );
          
          
          
          
          
          
          
          
        }

        
        if (vacancy.languages?.length) {
          upsertedVacancy.languages =
            await this.languageService.upsertRelations(
              upsertedVacancy,
              'vacancy',
              vacancy.languages,
              transactionHost,
            );
        }

        if (vacancy.citizenships?.length) {
          upsertedVacancy.citizenships =
            await this.citizenshipService.upsertRelations(
              upsertedVacancy,
              'vacancy',
              vacancy.citizenships,
              transactionHost,
            );
        }

        return upsertedVacancy;
      });
      return result;
    } catch (e) {
      console.log('Transaction has been rolled back: ', e);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async upsertBenefit(
    vacancy: Vacancy,
    benefitDto: CreateBenefitDto,
    transactionHost?: { transaction: any },
  ): Promise<Benefit> {
    const benefit = await this.benefitService.findOrCreate(
      benefitDto,
      transactionHost,
    );
    await vacancy.$add('benefits', benefit.id, transactionHost); 
    return benefit;
  }

  private async upsertBenefits(
    vacancy: Vacancy,
    benefitDtos: CreateBenefitDto[],
    transactionHost?: { transaction: any },
  ): Promise<Benefit[]> {
    if (benefitDtos?.length) {
      await this.deleteBenefits(vacancy.id, transactionHost); 
      return Promise.all(
        benefitDtos.map((benefitDto) =>
          this.upsertBenefit(vacancy, benefitDto, transactionHost),
        ),
      );
    }
  }

  private async deleteBenefits(
    vacancyId: number,
    transactionHost?: { transaction: any },
  ) {
    return this.vacancyBenefitRepository.destroy({
      where: { vacancyId },
      ...transactionHost,
    });
  }

  async changeIsActive(
    id: number,
    isActive: boolean,
    userId: number,
    role?: Roles,
  ): Promise<Vacancy> {
    let user: User;
    if (role !== Roles.admin) user = await this.usersService.getById(userId);
    if (role !== Roles.admin && user?.id !== userId) {
      throw new HttpException(
        `You can't delete this object`,
        HttpStatus.FORBIDDEN,
      );
    }

    const result = await this.vacancyRepository.update(
      { isActive },
      { where: { id }, returning: true },
    );
    return result[1][0];
  }

  async getPaginatedAll(
    page: number,
    pageSize = 10,
    query: any,
  ): Promise<PaginatedResponse<Vacancy>> {
    const whereCondition = mapQueryToWhereConditionVacancy(query);
    const whereConditionIndustry =
      query.industryIds && Array.isArray(JSON.parse(query.industryIds))
        ? { id: { [Op.in]: JSON.parse(query.industryIds) } }
        : undefined;
    const whereConditionBenefit =
      query.benefitIds && Array.isArray(JSON.parse(query.benefitIds))
        ? { id: { [Op.in]: JSON.parse(query.benefitIds) } }
        : undefined;
    const whereConditionSkill =
      query.skillIds && Array.isArray(JSON.parse(query.skillIds))
        ? { id: { [Op.in]: JSON.parse(query.skillIds) } }
        : undefined;
    const whereConditionLanguage =
      query.languageIds && Array.isArray(JSON.parse(query.languageIds))
        ? { id: { [Op.in]: JSON.parse(query.languageIds) } }
        : undefined;
    const whereConditionCitizenship =
      query.citizenshipIds && Array.isArray(JSON.parse(query.citizenshipIds))
        ? { id: { [Op.in]: JSON.parse(query.citizenshipIds) } }
        : undefined;

    let whereConditionCompany;
    if (query.isStartup)
      whereConditionCompany = { isStartup: query.isStartup === 'true' };
    if (query.isCompanyVerified)
      whereConditionCompany = {
        ...whereConditionCompany,
        isVerified: query.isCompanyVerified === 'true',
      };
    if (query.companySizes && Array.isArray(JSON.parse(query.companySizes)))
      whereConditionCompany = {
        ...whereConditionCompany,
        companySize: {
          [Op.in]: JSON.parse(query.companySizes),
        },
      };

    const orderCondition = mapQueryToOrderConditionVacancy(query);

    const { count, rows: vacancies } =
      await this.vacancyRepository.findAndCountAll({
        where: whereCondition,
        ...paginate(page, pageSize),
        include: [
          {
            model: User,
            as: 'likes',
          },
          {
            model: User,
            as: 'views',
          },
          {
            model: User,
            as: 'responds',
          },
          {
            model: VacancyComments,
            include: [{ model: User, as: 'user' }],
          },
          {
            model: Category,
          },
          {
            model: Company,
            where: whereConditionCompany,
            include: [
              {
                model: Industry,
                where: whereConditionIndustry, 
              },
            ],
          },
          { model: City },
          {
            model: Benefit,
            where: whereConditionBenefit,
          },
          {
            model: Language,
            where: whereConditionLanguage,
          },
          {
            model: Citizenship,
            where: whereConditionCitizenship,
          },
          {
            model: Skill,
            where: whereConditionSkill,
          },
        ],
        attributes: {
          include: [
            [
              Sequelize.literal(`(
                      SELECT COUNT(vl.id)
                      FROM vacancies AS v
                      LEFT OUTER JOIN vacancy_likes vl on vl.id = v."vacancyId"
                      GROUP BY v.id
                      HAVING v.id = "Vacancy".id
                  )`),
              'likesCount',
            ],
            [
              Sequelize.literal(`(
                      SELECT COUNT(vv.id)
                      FROM vacancies AS v
                      LEFT OUTER JOIN vacancy_views vv on vc.id = v."vacancyId"
                      GROUP BY v.id
                      HAVING v.id = "Vacancy".id
                  )`),
              'viewsCount',
            ],
            [
              Sequelize.literal(`(
                      SELECT COUNT(vr.id)
                      FROM vacancies AS v
                      LEFT OUTER JOIN vacancy_responds vr on vr.id = v."vacancyId"
                      GROUP BY v.id
                      HAVING v.id = "Vacancy".id
                  )`),
              'respondsCount',
            ],
          ],
        },
        order: orderCondition,
      });

    return {
      results: vacancies,
      ...getInfoPagination(page, pageSize, count),
    };
  }

  async getPaginatedMyReactions(
    dataKey: 'likes' | 'responds' | 'views',
    userId: number,
    page: number,
    pageSize: number,
  ): Promise<PaginatedResponse<Vacancy>> {
    const model =
      dataKey === 'likes'
        ? 'VacancyLikes'
        : dataKey === 'responds'
        ? 'VacancyResponds'
        : 'VacancyViews';
    const includeCondition = [
      {
        model: User,
        where: { id: userId },
        as: dataKey,
        required: true,
        duplicating: false,
      },
    ];
    const pagination = paginate(page, pageSize);

    const { count, rows: vacancies } =
      await this.vacancyRepository.findAndCountAll({
        ...pagination,
        include: includeCondition,
        order: [
          [Sequelize.literal(`"${dataKey}->${model}"."updatedAt"`), 'DESC'],
        ],
        
      });

    return {
      results: vacancies,
      ...getInfoPagination(page, pageSize, count),
    };
  }

  async delete(id: number, userId: number, role?: Roles) {
    let user: User;
    if (role !== Roles.admin) user = await this.usersService.getById(userId);
    if (role !== Roles.admin && user?.id !== userId) {
      throw new HttpException(
        `You can't delete this object`,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.fileService.deleteAllByPrefix(id + '_', 'images/vacancy');
    await this.fileService.deleteAllByPrefix(id + '_', 'reports/pdf/vacancy');
    await this.fileService.deleteAllByPrefix(id + '_', 'reports/docx/vacancy');
    
    return this.vacancyRepository.destroy({ where: { id } });
  }

  async deleteVacancyBenefits(vacancyId: number, benefitIds: number[]) {
    return this.vacancyBenefitRepository.destroy({
      where: { vacancyId, benefitId: { [Op.in]: benefitIds } },
    });
  }

  async setLike(vacancyId: number, userId: number) {
    const [like] = await this.vacancyLikesRepository.findOrCreate({
      where: { vacancyId, userId },
      defaults: { vacancyId, userId },
    });
    return like;
  }

  async deleteLike(vacancyId: number, userId: number) {
    return this.vacancyLikesRepository.destroy({
      where: { vacancyId, userId },
    });
  }

  public async setCommentLike(commentId: number, userId: number) {
    const [like] = await this.vacancyCommentLikesRepository.findOrCreate({
      where: { commentId, userId },
      defaults: { commentId, userId },
    });
    return like;
  }

  public async deleteCommentLike(commentId: number, userId: number) {
    return this.vacancyCommentLikesRepository.destroy({
      where: { commentId, userId },
    });
  }

  async setView(vacancyId: number, userId: number) {
    const [view] = await this.vacancyViewsRepository.findOrCreate({
      where: { vacancyId, userId },
      defaults: { vacancyId, userId },
    });
    return view;
  }

  async setRespond(vacancyId: number, userId: number) {
    const [respond] = await this.vacancyRespondsRepository.findOrCreate({
      where: { vacancyId, userId },
      defaults: { vacancyId, userId },
    });
    return respond;
  }

  async setLikeViewed(vacancyId: number, userId: number) {
    const reaction = await this.vacancyLikesRepository.update(
      { isViewed: true },
      {
        where: { vacancyId, userId },
        returning: true,
      },
    );
    return reaction[1][0];
  }

  async setRespondViewed(vacancyId: number, userId: number) {
    const reaction = await this.vacancyRespondsRepository.update(
      { isViewed: true },
      {
        where: { vacancyId, userId },
        returning: true,
      },
    );
    return reaction[1][0];
  }

  async setViewViewed(vacancyId: number, userId: number) {
    const reaction = await this.vacancyViewsRepository.update(
      { isViewed: true },
      {
        where: { vacancyId, userId },
        returning: true,
      },
    );
    return reaction[1][0];
  }

  public async createComplaint(
    vacancyId: number,
    userId: number,
    description?: string,
  ): Promise<VacancyComplaints> {
    const [complaint] = await this.vacancyComplaintsRepository.findOrCreate({
      where: { vacancyId, userId, description },
      defaults: { vacancyId, userId },
    });
    return complaint;
  }

  public async getComplaints(): Promise<VacancyComplaints[]> {
    return this.vacancyComplaintsRepository.findAll({
      include: [{ model: User }, { model: Vacancy }],
    });
  }

  public async createComment(
    vacancyId: number,
    userId: number,
    message: string,
  ) {
    
    const comment = await this.vacancyCommentsRepository.create({
      vacancyId,
      userId,
      message,
    });
    return comment;
  }

  public async updateComment(
    id: number,
    userId: number,
    role: Roles,
    message: string,
  ) {
    const comment = await this.vacancyCommentsRepository.findByPk(id);
    if (!comment) {
      throw new HttpException(`Comment not found`, HttpStatus.BAD_REQUEST);
    }
    if (comment.userId !== userId && role !== Roles.admin) {
      throw new HttpException(
        `Can't update comment, you are not an author!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.vacancyCommentsRepository.update(
      {
        message,
      },
      { where: { id }, returning: true },
    );
    return result[1][0];
  }

  public async deleteComment(id: number, userId: number, role: Roles) {
    const comment = await this.vacancyCommentsRepository.findByPk(id);
    if (!comment) {
      this.logger.warn(`Comment with id ${id} already deleted`);
      return;
    }

    if (comment.userId !== userId && role !== Roles.admin) {
      throw new HttpException(
        `Can't update comment, you are not an author!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.vacancyCommentsRepository.destroy({ where: { id } });
  }

  public async banVacancy(
    id: number,
    banReason?: string | null,
  ): Promise<Vacancy> {
    const result = await this.vacancyRepository.update(
      { isBanned: true, banReason, banDate: new Date() },
      { where: { id }, returning: true },
    );

    return result[1][0];
  }

  public async unbanVacancy(id: number): Promise<Vacancy> {
    const result = await this.vacancyRepository.update(
      { isBanned: false, banReason: null, banDate: null },
      { where: { id }, returning: true },
    );

    return result[1][0];
  }

  public async banUserVacancies(
    userId: number,
    banReason?: string | null,
  ): Promise<boolean> {
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        await this.vacancyRepository.update(
          { isBanned: true, banReason, banDate: new Date() },
          { where: { userId }, ...transactionHost },
        );
        return true;
      });
      return result;
    } catch (e) {
      this.logger.error(`Transaction has been rolled back: ${e}`);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async createPDF(vacancyId: number): Promise<string> {
    const vacancy = await this.get(vacancyId);
    const html = getVacancyHtml(vacancy);
    return this.fileService.createPDF(
      vacancy,
      html,
      `${vacancy.id}_${new Date()
        .toDateString()
        .split(' ')
        .filter((_, i) => i !== 0)
        .join('_')}_`,
      'reports/pdf/vacancy',
    );
  }

  public async createDOCX(vacancyId: number): Promise<string> {
    const vacancy = await this.get(vacancyId);
    const html = getVacancyHtml(vacancy);
    return this.fileService.createDOCX(
      html,
      `${vacancy.id}_${new Date()
        .toDateString()
        .split(' ')
        .filter((_, i) => i !== 0)
        .join('_')}_`,
      'reports/docx/vacancy',
    );
  }

  public async deleteAllFiles() {
    await this.fileService.deleteAllByPrefix('', 'reports/pdf/vacancy');
    await this.fileService.deleteAllByPrefix('', 'reports/docx/vacancy');
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'handleNewVacancyNotifications', 
  })
  async handleNewVacancyNotifications() {
    const traceId = uuid();
    this.logger.info(
      VacancyService.name,
      '...handleNewVacancyNotifications started...',
      {
        traceId,
      },
    );
    const start = performance.now();
    let count = 0;
    try {
      const newVacancyIds = await this.cacheManager.get<number[]>(
        'newVacancyIds',
      );
      if (!newVacancyIds?.length) return;

      const filters = await this.filterService.getVacanciesFilters();
      for (const filter of filters) {
        try {
          const query = {
            ...filter.query,
            ids: newVacancyIds,
            page: 1,
          };
          const result = await this.getPaginatedAll(query, {}, filter.userId);
          
          
          for (const vacancy of result.results) {
            if (vacancy.userId !== filter.userId) {
              count++;
              const notification = await this.notificationsService.create(
                filter.userId,
                {
                  title: 'Новая вакансия по твоему запросу!',
                  message: vacancy.title,
                  source: NOTIFICATION_SOURCES.VACANCY,
                  sourceId: vacancy.id,
                },
              );
              await this.socketGateway.handleNewNotification(
                notification,
                notification.userId,
              );
            }
          }
        } catch (e) {
          this.logger.error(
            VacancyService.name,
            'handleNewVacancyNotifications filter errored',
            {
              stack: e.stack,
              traceId,
            },
          );
        }
      }
      await this.cacheManager.del('newVacancyIds');
      this.logger.info(
        VacancyService.name,
        '...handleNewVacancyNotifications finished...',
        {
          newVacancyIds,
          filtersCount: filters?.length,
          notificationsCreated: count,
          timeSpent: performance.now() - start + 'ms',
          traceId,
        },
      );
    } catch (e) {
      this.logger.error(
        VacancyService.name,
        'handleNewVacancyNotifications error',
        {
          stack: e.stack,
          notificationsCreated: count,
          timeSpent: performance.now() - start + 'ms',
          traceId,
        },
      );
    }
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'vacancies-publishingService', 
  })
  async publishingService() {
    const traceId = uuid();
    this.logger.info(VacancyService.name, '...publishingService started...', {
      traceId,
    });
    const start = performance.now();
    let count = 0;
    try {
      const plannedVacancyIds = await this.cacheManager.get<number[]>(
        'plannedVacancyIds',
      );
      if (!plannedVacancyIds?.length) return;

      const vacancies = await this.vacancyRepository.findAll({
        where: {
          id: {
            [Op.in]: plannedVacancyIds,
          },
          publishDate: {
            
            [Op.lte]: moment().add(1, 'minute').toDate(),
          },
        },
      });
      for (const vacancy of vacancies) {
        try {
          count++;
          await this.vacancyRepository.update(
            {
              isActive: true,
            },
            {
              where: {
                id: vacancy.id,
              },
            },
          );
        } catch (e) {
          this.logger.error(VacancyService.name, 'publishingService errored', {
            stack: e.stack,
            traceId,
          });
        }
      }
      const updatedPlannedVacancyIds = plannedVacancyIds.filter(
        (id) => !vacancies.find((v) => v.id === id),
      );
      await this.cacheManager.set(
        'plannedVacancyIds',
        updatedPlannedVacancyIds,
      );
      this.logger.info(
        VacancyService.name,
        '...publishingService finished...',
        {
          plannedVacancyIds,
          vacanciesPublished: count,
          timeSpent: performance.now() - start + 'ms',
          traceId,
        },
      );
    } catch (e) {
      this.logger.error(VacancyService.name, 'publishingService error', {
        stack: e.stack,
        vacanciesPublished: count,
        timeSpent: performance.now() - start + 'ms',
        traceId,
      });
    }
  }
}
