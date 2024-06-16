import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Company } from 'src/company/company.model';
import { CompanyService } from 'src/company/company.service';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { CreateWorkExperienceDto } from './dto/create-workExperience.dto';
import { WorkExperience } from './workExperience.model';
import { Op } from 'sequelize';

@Injectable()
export class WorkExperienceService {
  constructor(
    @InjectModel(WorkExperience)
    private readonly workExperienceRepository: typeof WorkExperience,
    private readonly companyService: CompanyService,
  ) {}

  async upsert(
    resumeId: number,
    dto: CreateWorkExperienceDto,
  ): Promise<WorkExperience> {
    try {
      const company: CreateCompanyDto = {
        name: dto.company.name,
      };

      let upsertedCompany: Company;
      if (company.name)
        upsertedCompany = await this.companyService.findOrCreate(company);

      const [upsertedWorkExperience] =
        await this.workExperienceRepository.upsert({
          ...dto,
          resumeId,
          companyId: upsertedCompany?.id,
        });

      return upsertedWorkExperience;
    } catch (e) {
      console.log(e);
    }
  }

  async upsertMany(
    resumeId: number,
    dto: CreateWorkExperienceDto[],
  ): Promise<WorkExperience[]> {
    try {
      return Promise.all(dto.map((ed) => this.upsert(resumeId, ed)));
    } catch (e) {
      console.log(e);
    }
  }

  async deleteMany(ids: number[]) {
    return this.workExperienceRepository.destroy({
      where: { id: { [Op.in]: ids } },
    });
  }
}
