import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from 'src/company/company.model';
import { Education } from 'src/education/education.model';
import { EducationOrganization } from 'src/educationOrganization/educationOrganization.model';
import { User } from 'src/users/users.model';
import { PaginatedResponse } from 'src/utils/interfaces';
import {
  getInfoPagination,
  getResumeHtml,
  mapQueryToOrderConditionResume,
  mapQueryToWhereConditionResume,
  paginate,
} from 'src/utils/utils';
import { WorkExperience } from 'src/workExperience/workExperience.model';
import { CreateResumeDto } from './dto/create-resume.dto';
import { ResumeLikes } from './resume-likes.model';
import { ResumeResponds } from './resume-responds.model';
import { ResumeViews } from './resume-views.model';
import { Resume } from './resume.model';
import { Category } from 'src/category/category.model';
import { Sequelize } from 'sequelize-typescript';
import { CreateCategoryDto } from 'src/category/dto/create-category.dto';
import { City } from 'src/city/city.model';
import { Op } from 'sequelize';
import { Industry } from 'src/industry/industry.model';
import { CategoryService } from 'src/category/category.service';
import { CreateSkillDto } from 'src/skills/dto/create-skill.dto';
import { Skill } from 'src/skills/skill.model';
import { SkillService } from 'src/skills/skill.service';
import { Language } from 'src/language/language.model';
import { LanguageService } from 'src/language/language.service';
import { FilesService } from 'src/files/files.service';
import { Citizenship } from 'src/citizenship/citizenship.model';
import { Role, Roles } from 'src/roles/roles.model';
import { UsersService } from 'src/users/users.service';
import { PinoLoggerService } from 'src/logger/logger.service';
import { ResumeComplaints } from './resume-complaints.model';
import { ResumeComments } from './resume-comments.model';
import { ResumeCommentLikes } from './resume-comment-likes.model';

@Injectable()
export class ResumeService {
  constructor(
    @InjectModel(Resume) private readonly resumeRepository: typeof Resume,
    @InjectModel(ResumeLikes)
    private readonly resumeLikesRepository: typeof ResumeLikes,
    @InjectModel(ResumeViews)
    private readonly resumeViewsRepository: typeof ResumeViews,
    @InjectModel(ResumeResponds)
    private readonly resumeRespondsRepository: typeof ResumeResponds,
    @InjectModel(ResumeComplaints)
    private readonly resumeComplaintsRepository: typeof ResumeComplaints,
    @InjectModel(ResumeComments)
    private readonly resumeCommentsRepository: typeof ResumeComments,
    @InjectModel(ResumeCommentLikes)
    private readonly resumeCommentLikesRepository: typeof ResumeCommentLikes,
    private readonly categoryService: CategoryService,
    private readonly skillService: SkillService,
    private readonly languageService: LanguageService,
    private readonly usersService: UsersService,
    private readonly fileService: FilesService,
    private readonly sequelize: Sequelize,
    private readonly logger: PinoLoggerService,
  ) {
    this.logger.setContext(ResumeService.name);
  }

  public async get(id: number): Promise<Resume> {
    return this.resumeRepository.findByPk(id, {
      include: [
        { all: true },
        {
          model: Education,
          include: [{ model: EducationOrganization }],
        },
        {
          model: WorkExperience,
          include: [{ model: Company }],
        },
        {
          model: ResumeComments,
          include: [
            { model: User, as: 'user', include: [{ model: Role }] },
            { model: User, as: 'likes' },
          ],
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
                    SELECT SUM((DATE_PART('day', COALESCE(we."endDate", now()::timestamp) - 
                    COALESCE(we."startDate", now()::timestamp))) / 365.25)
                    FROM resume AS r
                    LEFT OUTER JOIN "workExperiences" we on r.id = we."resumeId"
                    GROUP BY we."resumeId", r.id
                    HAVING r.id = "Resume".id
                )`),
            'workExperienceYears',
          ],
          [
            Sequelize.literal(`(
                    SELECT SUM((DATE_PART('day', COALESCE(e."endDate", now()::timestamp) - 
                    COALESCE(e."startDate", now()::timestamp))) / 365.25)
                    FROM resume AS r
                    LEFT OUTER JOIN "educations" e on r.id = e."resumeId"
                    GROUP BY e."resumeId", r.id
                    HAVING r.id = "Resume".id
                )`),
            'educationYears',
          ],
        ],
      },
    });
  }

  public async getAllMy(userId: number): Promise<Resume[]> {
    return this.resumeRepository.findAll({
      where: { userId },
      include: [
        { all: true },
        {
          model: Education,
          include: [{ model: EducationOrganization }],
        },
        {
          model: WorkExperience,
          include: [{ model: Company }],
        },
      ],
    });
  }

  public async upsertSkills(
    resumeId: number,
    skills: CreateSkillDto[],
  ): Promise<Skill[]> {
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const resume = await this.resumeRepository.findByPk(resumeId);
        return this.skillService.upsertRelations(
          resume,
          'vacancy',
          skills,
          transactionHost,
        );
      });
      return result;
    } catch (e) {
      this.logger.error(`Transaction has been rolled back: ${e}`);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async upsert(userId: number, dto: CreateResumeDto): Promise<Resume> {
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };

        const resume = { ...dto, userId };
        const category: CreateCategoryDto = {
          title: dto.category.title,
          description: dto.category.description || null,
          parentId: dto.category.parentId || null,
        };

        
        let upsertedCategory: Category;
        if (category.title)
          if (category.title)
            upsertedCategory = await this.categoryService.findOrCreate(
              category,
              transactionHost,
            );

        
        const [upsertedResume] = await this.resumeRepository.upsert(
          {
            ...resume,
            categoryId: upsertedCategory?.id,
          },
          transactionHost,
        );

        
        if (resume.languages?.length) {
          upsertedResume.languages = await this.languageService.upsertRelations(
            upsertedResume,
            'resume',
            resume.languages,
            transactionHost,
          );
        }

        return upsertedResume;
      });
      return result;
    } catch (e) {
      this.logger.error(`Transaction has been rolled back: ${e}`);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async upsertImage(
    id: number,
    image: Express.Multer.File,
  ): Promise<Resume> {
    const resume = await this.resumeRepository.findByPk(id);
    const oldImageName = resume.imageName;
    const imageName = await this.fileService.upsert(
      image,
      'image/resume',
      id + '_',
      oldImageName,
    );

    const result = await this.resumeRepository.update(
      { imageName },
      { where: { id }, returning: true },
    );

    return result[1][0];
  }

  public async deleteImage(id: number, imageName?: string): Promise<Resume> {
    const resume = await this.resumeRepository.findByPk(id);

    if (imageName) await this.fileService.delete(imageName, 'images/resumes');
    else {
      await this.fileService.delete(resume.imageName, 'images/resumes');
    }

    
    if (resume.imageName === imageName || !imageName) {
      const result = await this.resumeRepository.update(
        { imageName: null },
        { where: { id }, returning: true },
      );
      return result[1][0];
    }
    return resume;
  }

  public async delete(id: number, userId: number, role?: Roles) {
    let user: User;
    if (role !== Roles.admin) user = await this.usersService.getById(userId);
    if (role !== Roles.admin && user?.id !== userId) {
      throw new HttpException(
        `You can't delete this object`,
        HttpStatus.FORBIDDEN,
      );
    }

    await this.fileService.deleteAllByPrefix(id + '_', 'images/resumes');
    await this.fileService.deleteAllByPrefix(id + '_', 'report/pdf/resume');
    await this.fileService.deleteAllByPrefix(id + '_', 'report/docx/resume');
    
    return this.resumeRepository.destroy({ where: { id } });
  }

  public async changeIsActive(
    id: number,
    isActive: boolean,
    userId: number,
    role?: Roles,
  ): Promise<Resume> {
    let user: User;
    if (role !== Roles.admin) user = await this.usersService.getById(userId);
    if (role !== Roles.admin && user?.id !== userId) {
      throw new HttpException(
        `You can't delete this object`,
        HttpStatus.FORBIDDEN,
      );
    }

    const result = await this.resumeRepository.update(
      { isActive },
      { where: { id }, returning: true },
    );
    return result[1][0];
  }

  public async getPaginatedAll(
    page: number,
    pageSize = 10,
    query: any,
  ): Promise<PaginatedResponse<Resume>> {
    const whereCondition = mapQueryToWhereConditionResume(query);
    const whereConditionWorkExperience =
      this.getWhereConditionWorkExperience(query);
    const whereConditionEducation = this.getWhereConditionEducation(query);
    const whereConditionIndustry =
      query.industryIds && Array.isArray(JSON.parse(query.industryIds))
        ? { id: { [Op.in]: JSON.parse(query.industryIds) } }
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

    let whereConditionWorkExperienceCompany;
    if (
      query.workExperienceCompanies &&
      Array.isArray(JSON.parse(query.workExperienceCompanies))
    )
      whereConditionWorkExperienceCompany = {
        id: { [Op.in]: JSON.parse(query.workExperienceCompanies) },
      };

    let whereConditionEducationOrganization;
    if (
      query.educationOrganizations &&
      Array.isArray(JSON.parse(query.educationOrganizations))
    )
      whereConditionEducationOrganization = {
        id: { [Op.in]: JSON.parse(query.educationOrganizations) },
      };

    let whereConditionUser;
    if (
      query.ageMin &&
      !isNaN(parseInt(query.ageMin)) &&
      query.ageMax &&
      !isNaN(parseInt(query.ageMax)) &&
      parseInt(query.ageMin) <= parseInt(query.ageMax)
    ) {
      whereConditionUser = Sequelize.literal(
        `date_part('year', age(COALESCE("user"."birthDate", now()::timestamp))) <= ${query.ageMax}
         AND
         date_part('year', age(COALESCE("user"."birthDate", now()::timestamp))) >= ${query.ageMin}`,
      );
    } else if (query.ageMin && !isNaN(parseInt(query.ageMin))) {
      whereConditionUser = Sequelize.literal(
        `date_part('year', age(COALESCE("user"."birthDate", now()::timestamp))) >= ${query.ageMin}`,
      );
    } else if (query.ageMax && !isNaN(parseInt(query.ageMax)))
      whereConditionUser = Sequelize.literal(
        `date_part('year', age(COALESCE("user"."birthDate", now()::timestamp))) <= ${query.ageMax}`,
      );

    const orderCondition = mapQueryToOrderConditionResume(query);

    const { count, rows: resume } = await this.resumeRepository.findAndCountAll(
      {
        where: whereCondition,
        ...paginate(page, pageSize),
        include: [
          {
            model: User,
            as: 'user',
            where: whereConditionUser,
            attributes: {
              include: [
                [
                  Sequelize.literal(`(
                          SELECT date_part('year', age(COALESCE(u."birthDate", now()::timestamp)))
                          FROM users u
                          WHERE "Resume"."userId" = u.id
                      )`),
                  'userAge',
                ],
              ],
            },
          },
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
            model: ResumeComments,
            include: [{ model: User, as: 'user' }],
          },
          {
            model: Industry,
            where: whereConditionIndustry,
          },
          {
            model: Category,
          },
          {
            model: City,
          },
          {
            model: Education,
            where: whereConditionEducation,
            include: [
              {
                model: EducationOrganization,
                where: whereConditionEducationOrganization,
              },
            ],
          },
          {
            model: WorkExperience,
            where: whereConditionWorkExperience,
            include: [
              {
                model: Company,
                where: whereConditionWorkExperienceCompany,
              },
            ],
          },
          {
            model: Skill,
            where: whereConditionSkill,
          },
          {
            model: Language,
            where: whereConditionLanguage,
          },
          {
            model: Citizenship,
            where: whereConditionCitizenship,
          },
        ],
        attributes: {
          include: [
            [
              Sequelize.literal(`(
                      SELECT SUM(DATE_PART('day', COALESCE(we."endsDate", now()::timestamp) - COALESCE(we."startsDate", now()::timestamp)) / 365.25)
                      FROM resume AS r
                      LEFT OUTER JOIN "workExperiences" we on we.id = r."resumeId"
                      GROUP BY we."resumeId", r.id
                      HAVING r.id = "Resume".id
                  )`),
              'workExperienceYears',
            ],
            [
              Sequelize.literal(`(
                      SELECT SUM(DATE_PART('day', COALESCE(e."endsDate", now()::timestamp) - COALESCE(e."starstDate", now()::timestamp)) / 365.25)
                      FROM resume AS r
                      LEFT OUTER JOIN "educations" e on e.id = e."resumeId"
                      GROUP BY e."resumeId", r.id
                      HAVING r.id = "Resume".id
                  )`),
              'educationYears',
            ],
            [
              Sequelize.literal(`(
                      SELECT COUNT(rl.id)
                      FROM resume AS r
                      LEFT OUTER JOIN resume_likes l on r.id = l."resumeId" 
                      GROUP BY r.id 
                      HAVING r.id = "Resume".id
                  )`),
              'likesCount',
            ],
            [
              Sequelize.literal(`(
                      SELECT COUNT(rv.id)
                      FROM resume AS r
                      LEFT OUTER JOIN resume_views v on r.id = v."resumeId" 
                      GROUP BY r.id 
                      HAVING r.id = "Resume".id
                  )`),
              'viewsCount',
            ],
            [
              Sequelize.literal(`(
                      SELECT COUNT(rr.id)
                      FROM resume AS r
                      LEFT OUTER JOIN resume_responds r on r.id = r."resumeId" 
                      GROUP BY r.id 
                      HAVING r.id = "Resume".id
                  )`),
              'respondsCount',
            ],
          ],
        },
        order: orderCondition,
      },
    );

    return {
      results: resume,
      ...getInfoPagination(page, pageSize, count),
    };
  }

  public async getPaginatedMyReactions(
    dataKey: 'likes' | 'responds' | 'views',
    userId: number,
    page: number,
    pageSize: number,
  ): Promise<PaginatedResponse<Resume>> {
    const model =
      dataKey === 'likes'
        ? 'ResumeLikes'
        : dataKey === 'responds'
        ? 'ResumeResponds'
        : 'ResumeViews';
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

    const { count, rows: resume } = await this.resumeRepository.findAndCountAll(
      {
        ...pagination,
        include: includeCondition,
        order: [
          [Sequelize.literal(`"${dataKey}->${model}"."updatedAt"`), 'DESC'],
          
          
        ],
        
      },
    );

    return {
      results: resume,
      ...getInfoPagination(page, pageSize, count),
    };
  }

  public async setLike(resumeId: number, userId: number) {
    const [like] = await this.resumeLikesRepository.findOrCreate({
      where: { resumeId, userId },
      defaults: { resumeId, userId },
    });
    return like;
  }

  public async deleteLike(resumeId: number, userId: number) {
    return this.resumeLikesRepository.destroy({
      where: { resumeId, userId },
    });
  }

  public async setCommentLike(commentId: number, userId: number) {
    const [like] = await this.resumeCommentLikesRepository.findOrCreate({
      where: { commentId, userId },
      defaults: { commentId, userId },
    });
    return like;
  }

  public async deleteCommentLike(commentId: number, userId: number) {
    return this.resumeCommentLikesRepository.destroy({
      where: { commentId, userId },
    });
  }

  public async setView(resumeId: number, userId: number) {
    const [view] = await this.resumeViewsRepository.findOrCreate({
      where: { resumeId, userId },
      defaults: { resumeId, userId },
    });
    return view;
  }

  public async setRespond(resumeId: number, userId: number) {
    const [respond] = await this.resumeRespondsRepository.findOrCreate({
      where: { resumeId, userId },
      defaults: { resumeId, userId },
    });
    return respond;
  }

  public async setLikeViewed(resumeId: number, userId: number) {
    const reaction = await this.resumeLikesRepository.update(
      { isViewed: true },
      {
        where: { resumeId, userId },
        returning: true,
      },
    );
    return reaction[1][0];
  }

  public async setRespondViewed(resumeId: number, userId: number) {
    const reaction = await this.resumeRespondsRepository.update(
      { isViewed: true },
      {
        where: { resumeId, userId },
        returning: true,
      },
    );
    return reaction[1][0];
  }

  public async setViewViewed(resumeId: number, userId: number) {
    const reaction = await this.resumeViewsRepository.update(
      { isViewed: true },
      {
        where: { resumeId, userId },
        returning: true,
      },
    );
    return reaction[1][0];
  }

  public async createComplaint(
    resumeId: number,
    userId: number,
    description?: string,
  ): Promise<ResumeComplaints> {
    const [complaint] = await this.resumeComplaintsRepository.findOrCreate({
      where: { resumeId, userId, description },
      defaults: { resumeId, userId },
    });
    return complaint;
  }

  public async getComplaints(): Promise<ResumeComplaints[]> {
    return this.resumeComplaintsRepository.findAll({
      include: [{ model: User }, { model: Resume }],
    });
  }

  public async createComment(
    resumeId: number,
    userId: number,
    message: string,
  ) {
    
    const comment = await this.resumeCommentsRepository.create({
      resumeId,
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
    const comment = await this.resumeCommentsRepository.findByPk(id);
    if (!comment) {
      throw new HttpException(`Comment not found`, HttpStatus.BAD_REQUEST);
    }
    if (comment.userId !== userId && role !== Roles.admin) {
      throw new HttpException(
        `Can't update comment, you are not an author!`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.resumeCommentsRepository.update(
      {
        message,
      },
      { where: { id }, returning: true },
    );
    return result[1][0];
  }

  public async deleteComment(id: number, userId: number, role: Roles) {
    const comment = await this.resumeCommentsRepository.findByPk(id);
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

    await this.resumeCommentsRepository.destroy({ where: { id } });
  }

  private getWhereConditionWorkExperience(query: any) {
    let whereCondition: any;

    if (
      query.workExperienceYearsMin &&
      !isNaN(parseInt(query.workExperienceYearsMin)) &&
      query.workExperienceYearsMax &&
      !isNaN(parseInt(query.workExperienceYearsMax))
    ) {
      whereCondition = {
        resumeId: {
          [Op.in]: Sequelize.literal(`(
            SELECT "resumeId" 
            FROM "workExperiences" re 
            GROUP BY we."resumeId"
            HAVING SUM((DATE_PART('day', we."endDate" - we."startsDate")) / 365.25) >= 
            ${query.workExperienceYearsMin}
            AND SUM((DATE_PART('day', we."endDate" - we."startsDate")) / 365.25) <= 
            ${query.workExperienceYearsMax}            
        )`),
        },
      };
    } else if (
      query.workExperienceYearsMin &&
      !isNaN(parseInt(query.workExperienceYearsMin))
    ) {
      whereCondition = {
        resumeId: {
          [Op.in]: Sequelize.literal(`(
              SELECT "resumeId" 
              FROM "workExperiences" we 
              GROUP BY we."resumeId"
              HAVING SUM((DATE_PART'day', we."endDate" - we."startDate")) / 365.25) >= 
              ${query.workExperienceYearsMin}
          )`),
        },
      };
    } 
     else if (
      query.workExperienceYearsMax &&
      !isNaN(parseInt(query.workExperienceYearsMax))
    )
      whereCondition = {
        resumeId: {
          [Op.in]: Sequelize.literal(`(
              SELECT we."resumeId"
              FROM "workExperiences" we
              GROUP BY we."resumeId"
              HAVING SUM((DATE_PART('day', COALESCE(we."endDate", now()::timestamp) -
              COALESCE(we."startDate", now()::timestamp))) / 365.25) <=
              ${query.workExperienceYearsMax}
          )`),
          [Op.or]: [
            {
              [Op.in]: Sequelize.literal(`(
                SELECT we."resumeId"
                FROM "workExperiences" we
                GROUP BY we."resumeId"
                HAVING SUM((DATE_PART('day', we."endDate" - we."startDate")) / 365.25) <=
                ${query.workExperienceYearsMax}
            )`),
            },
            {
              [Op.notIn]: Sequelize.literal(`(
              SELECT we."resumeId"
              FROM "workExperiences" we
              GROUP BY we."resumeId"
          )`),
              }
              [Op.in]: Sequelize.literal(`(
                SELECT we."resumeId"
                FROM "workExperiences" we
                GROUP BY we."resumeId", we."startDate", we."endDate"
                HAVING (we."startDate" is null AND we."endDate" is null)
              )`),
              [Op.is]: null,
          ],
        },
      };

    return whereCondition;
  }

  private getWhereConditionEducation(query: any) {
    let whereCondition: any;

    if (
      query.educationYearsMin &&
      !isNaN(parseInt(query.educationYearsMin)) &&
      query.educationYearsMax &&
      !isNaN(parseInt(query.educationYearsMax))
    ) {
      whereCondition = {
        resumeId: {
          [Op.in]: Sequelize.literal(`(
              SELECT "resumeId" 
              FROM "educations" e 
              GROUP BY e."resumeId"
              HAVING SUM((DATE_PART('day', e."endDate" - e."startDate")) / 365.25) >= 
              ${query.educationYearsMin}
              AND SUM((DATE_PART('day', e."endDate" - e."startDate")) / 365.25) <= 
              ${query.educationYearsMax}
          )`),
        },
      };
    } else if (
      query.educationYearsMin &&
      !isNaN(parseInt(query.educationYearsMin))
    ) {
      whereCondition = {
        resumeId: {
          [Op.in]: Sequelize.literal(`(
              SELECT "resumeId" 
              FROM "educations" e 
              GROUP BY e."resumeId"
              HAVING SUM((DATE_PART('day', e."endDate" - e."startDate")) / 365.25) >= 
              ${query.educationYearsMin}
          )`),
        },
      };
    } 
     else if (
      query.educationYearsMax &&
      !isNaN(parseInt(query.educationYearsMax))
    ) {
      whereCondition = {
        resumeId: {
          [Op.in]: Sequelize.literal(`(
            SELECT "resumeId"
            FROM "educations" e
            GROUP BY e."resumeId"
            HAVING SUM((DATE_PART('day', e."endDate" - e."startDate")) / 365.25) <=
              ${query.educationYearsMax}
          )`),
        },
      };
    }

    if (query.educationTypes && Array.isArray(JSON.parse(query.educationTypes)))
      whereCondition = {
        ...whereCondition,
        qualificationType: {
          [Op.in]: JSON.parse(query.educationTypes),
        },
      };

    return whereCondition;
  }

  public async banResume(
    id: number,
    banReason?: string | null,
  ): Promise<Resume> {
    const result = await this.resumeRepository.update(
      { isBanned: true, banReason, banDate: new Date() },
      { where: { id }, returning: true },
    );

    return result[0][1];
  }

  public async unbanResume(id: number): Promise<Resume> {
    const result = await this.resumeRepository.update(
      { isBanned: false, banReason: null, banDate: null },
      { where: { id }, returning: true },
    );

    return result[0][1];
  }

  public async banUserResume(
    userId: number,
    banReason?: string | null,
  ): Promise<boolean> {
    try {
      const result = await this.sequelize.transaction(async (t) => {
        const transactionHost = { transaction: t };
        await this.resumeRepository.update(
          { isBanned: true, banReason, banDate: new Date() },
          { where: { userId }, returning: true, ...transactionHost },
        );
        return true;
      });
      return result;
    } catch (e) {
      this.logger.error(`Transaction has been rolled back: ${e}`);
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  public async createPDF(resumeId: number): Promise<string> {
    const resume = await this.get(resumeId);
    const html = getResumeHtml(resume);
    return this.fileService.createPDF(
      resume,
      html,
      `${resume.id}_${new Date()
        .toDateString()
        .split(' ')
        .filter((_, i) => i !== 0)
        .join('_')}_`,
      'reports/pdf/resume',
    );
  }

  public async createDOCX(resumeId: number): Promise<string> {
    const resume = await this.get(resumeId);
    const html = getResumeHtml(resume);
    return this.fileService.createDOCX(
      html,
      `${resume.id}_${new Date()
        .toDateString()
        .split(' ')
        .filter((_, i) => i !== 0)
        .join('_')}_`,
      'reports/docx/resume',
    );
  }

  public async deleteAllFiles() {
    await this.fileService.deleteAllByPrefix('', 'reports/pdf/resume');
    await this.fileService.deleteAllByPrefix('', 'reports/docx/resume');
  }
}
