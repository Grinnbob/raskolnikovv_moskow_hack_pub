import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './company.model';
import { Op } from 'sequelize';
import { User } from 'src/users/users.model';
import { PaginatedResponse } from 'src/utils/interfaces';
import {
  mapQueryToWhereConditionCompany,
  mapQueryToOrderConditionCompany,
  paginate,
  getInfoPagination,
} from 'src/utils/utils';
import { FilesService } from 'src/files/files.service';
import { IndustryService } from 'src/industry/industry.service';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { CompanyRatings } from './company-rating.model';
import { UsersService } from 'src/users/users.service';
import { CompanyOwners } from './company-owners.model';
import { Roles } from 'src/roles/roles.model';
import { Industry } from 'src/industry/industry.model';
import { PinoLoggerService } from 'src/logger/logger.service';
import { Sequelize } from 'sequelize-typescript/dist/sequelize/sequelize/sequelize';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company) private readonly companyRepository: typeof Company,
    @InjectModel(CompanyRatings)
    private readonly companyRatingsRepository: typeof CompanyRatings,
    @InjectModel(CompanyOwners)
    private readonly companyOwnersRepository: typeof CompanyOwners,
    private readonly industryService: IndustryService,
    private readonly usersService: UsersService,
    private readonly fileService: FilesService,
    private readonly logger: PinoLoggerService,
  ) {
    this.logger.setContext(CompanyService.name);
  }

  async get(id: number): Promise<Company> {
    return this.companyRepository.findByPk(id, {
      include: { all: true },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
                  SELECT AVG(cr.rating)
                  FROM companies AS c
                  LEFT OUTER JOIN company_ratings cr ON c.id = cr."companyId"
                  GROUP BY c.id
                  HAVING c.id = "Company".id
              )`),
            'totalRating',
          ],
        ],
      },
    });
  }

  async getByName(name: string): Promise<Company> {
    return this.companyRepository.findOne({
      where: { name },
      include: { all: true },
    });
  }

  async getByVacancyId(id: number): Promise<Company> {
    return this.companyRepository.findOne({
      include: [
        { all: true },
        { model: Vacancy, where: { id } },
        { model: User, as: 'ratings' },
        { model: User, as: 'owners' },
      ],
    });
  }

  async getAll(): Promise<Company[]> {
    return this.companyRepository.findAll({ include: { model: Industry } });
  }

  async getPaginatedAll(
    page: number,
    pageSize = 10,
    query: any,
  ): Promise<PaginatedResponse<Company>> {
    const whereCondition = mapQueryToWhereConditionCompany(query);
    const orderCondition = mapQueryToOrderConditionCompany(query);

    const { rows: companies, count } =
      await this.companyRepository.findAndCountAll({
        where: whereCondition,
        ...paginate(page, pageSize),
        include: [
          {
            model: User,
            as: 'ratings',
          },
          
          
          
          
          
          
        ],
        
        attributes: {
          include: [
            [
              Sequelize.literal(`(
                      SELECT AVG(cr.rating)
                      FROM companies AS c
                      LEFT OUTER JOIN company_ratings cr ON c.id = cr."companyId"
                      GROUP BY c.id
                      HAVING c.id = "Company".id
                  )`),
              'totalRating',
            ],
            [
              Sequelize.literal(`(
                      SELECT COUNT(DISTINCT u.id) FROM "workExperiences" we 
                      LEFT OUTER JOIN resume r ON r.id = we."resumeId" 
                      LEFT OUTER JOIN companies c ON c.id = we."companyId"  
                      LEFT OUTER JOIN users u ON u.id = r."userId" 
                      GROUP BY c.id
                      HAVING c.id = "Company".id
                  )`),
              'emplyeesCount',
            ],
            [
              Sequelize.literal(`(
                      SELECT COUNT(v.id)
                      FROM companies c 
                      LEFT OUTER JOIN vacancies v ON v."companyId" = c.id 
                      WHERE v."isActive" = true
                      GROUP BY c.id
                      HAVING c.id = "Company".id
                  )`),
              'vacanciesCount',
            ],
          ],
        },
        order: orderCondition as any,
      });

    return {
      results: companies,
      ...getInfoPagination(page, pageSize, count),
    };
  }

  async findOrCreate(
    dto: CreateCompanyDto,
    transactionHost?: { transaction: any },
  ): Promise<Company> {
    let company = await this.companyRepository.findOne({
      where: { name: { [Op.iLike]: dto.name } },
    });

    if (!company)
      company = await this.companyRepository.create(dto, transactionHost);
    return company;
  }

  async addOwner(
    userId: number,
    companyId: number,
    transactionHost?: { transaction: any },
  ) {
    
    const result = await this.companyOwnersRepository.findOrCreate({
      where: { userId, companyId },
      ...transactionHost,
    });

    return result[0];
  }

  async upsert(
    userId: number,
    dto: CreateCompanyDto,
    transactionHost?: { transaction: any },
  ): Promise<Company> {
    let upsertedCompany: Company;
    const company = {
      ...dto,
      id: undefined,
      industries: undefined,
    };

    const oldCompany = await this.companyRepository.findOne({
      where: { name: { [Op.iLike]: dto.name } },
    });
    const user = await this.usersService.getById(userId);

    if (oldCompany?.id) {
      
      if (user?.role?.value !== Roles.admin) {
        const ownerships = await this.companyOwnersRepository.findOne({
          where: { userId, companyId: oldCompany.id },
        });
        if (!ownerships?.id)
          throw new HttpException(
            `Can't update company with id: ${oldCompany.id} because user with id: ${userId} is not owner`,
            HttpStatus.FORBIDDEN,
          );
      }

      const result = await this.companyRepository.update(company, {
        where: { id: oldCompany.id },
        returning: true,
        ...transactionHost,
      });
      upsertedCompany = result[1][0];
    } else {
      upsertedCompany = await this.companyRepository.create(company, {
        ...transactionHost,
      });
      await this.addOwner(userId, upsertedCompany.id, transactionHost);
    }

    
    if (dto.industries?.length) {
      upsertedCompany.industries = await this.industryService.upsertRelations(
        upsertedCompany,
        'company',
        dto.industries,
        transactionHost,
      );
    }

    return upsertedCompany;
  }

  async upsertImage(id: number, image: Express.Multer.File): Promise<Company> {
    const company = await this.companyRepository.findByPk(id);
    const oldImageName = company.imageName;
    const imageName = await this.fileService.upsert(
      image,
      'images/company',
      id + '_',
      oldImageName,
    );
    const result = await this.companyRepository.update(
      { imageName },
      { where: { id }, returning: true },
    );

    return result[1][0];
  }

  async deleteImage(id: number, imageName?: string): Promise<Company> {
    const company = await this.companyRepository.findByPk(id);

    if (imageName) await this.fileService.delete(imageName, 'images/company');
    else {
      await this.fileService.delete(company.imageName, 'images/company');
    }

    
    if (company.imageName === imageName || !imageName) {
      const result = await this.companyRepository.update(
        { imageName: null },
        { where: { id }, returning: true },
      );
      return result[1][0];
    }
    return company;
  }

  async upsertRating(
    companyId: number,
    userId: number,
    rating: number,
    recall?: string,
  ) {
    const ratingObject = await this.companyRatingsRepository.findOne({
      where: { companyId, userId },
    });
    if (!ratingObject) {
      return this.companyRatingsRepository.create({
        companyId,
        userId,
        rating,
        recall,
      });
    }

    const result = await this.companyRatingsRepository.update(
      { rating, recall },
      {
        where: { companyId, userId },
        returning: true,
      },
    );
    return result[1][0];
  }

  async deleteRating(companyId: number, userId: number) {
    return this.companyRatingsRepository.destroy({
      where: { companyId, userId },
    });
  }
}
