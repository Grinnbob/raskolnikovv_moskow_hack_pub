import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { Industry } from './industry.model';
import { Op } from 'sequelize';
import { Company } from 'src/company/company.model';
import { Resume } from 'src/resume/resume.model';
import { IndustryResume } from './industry-resume.model';
import { IndustryCompany } from './industry-company.model';

@Injectable()
export class IndustryService {
  constructor(
    @InjectModel(Industry) private readonly industryRepository: typeof Industry,
    @InjectModel(IndustryResume)
    private readonly industryResumeRepository: typeof IndustryResume,
    @InjectModel(IndustryCompany)
    private readonly industryCompanyRepository: typeof IndustryCompany,
  ) {}

  async upsert(dto: CreateIndustryDto): Promise<Industry> {
    const [result] = await this.industryRepository.upsert(dto);
    return result;
  }

  async getAll(): Promise<Industry[]> {
    return this.industryRepository.findAll();
  }

  async findOrCreate(
    dto: CreateIndustryDto,
    transactionHost?: { transaction: any },
  ): Promise<Industry> {
    const industryData = { title: dto.title };
    let industry = await this.industryRepository.findOne({
      where: { title: { [Op.iLike]: industryData.title } },
      ...transactionHost,
    });

    if (!industry)
      industry = await this.industryRepository.create(
        industryData,
        transactionHost,
      );

    return industry.dataValues;
  }

  public async upsertRelations(
    entity: Resume | Company,
    entityType: 'resume' | 'company',
    industryDtos: CreateIndustryDto[],
    transactionHost?: { transaction: any },
  ): Promise<Industry[]> {
    if (industryDtos?.length) {
      await this.deleteRelations(entity.id, entityType, transactionHost); 
      return Promise.all(
        industryDtos.map((industryDto) =>
          this.upsertRelation(entity, industryDto, transactionHost),
        ),
      );
    }
  }

  private async upsertRelation(
    entity: Resume | Company,
    industryDto: CreateIndustryDto,
    transactionHost?: { transaction: any },
  ): Promise<Industry> {
    const industry = await this.findOrCreate(industryDto, transactionHost);
    await entity.$add('industries', industry.id, transactionHost); 
    return industry;
  }

  private async deleteRelations(
    entityId: number,
    entityType: 'resume' | 'company',
    transactionHost?: { transaction: any },
  ) {
    if (entityType === 'resume') {
      return this.industryResumeRepository.destroy({
        where: { resumeId: entityId },
        ...transactionHost,
      });
    } else if (entityType === 'company') {
      return this.industryCompanyRepository.destroy({
        where: { companyId: entityId },
        ...transactionHost,
      });
    }
  }

  public async deleteCompanyIndustries(
    companyId: number,
    industryIds: number[],
  ) {
    return this.industryCompanyRepository.destroy({
      where: { companyId, industryId: { [Op.in]: industryIds } },
    });
  }

  public async deleteResumeIndustries(resumeId: number, industryIds: number[]) {
    return this.industryResumeRepository.destroy({
      where: { resumeId, industryId: { [Op.in]: industryIds } },
    });
  }
}
