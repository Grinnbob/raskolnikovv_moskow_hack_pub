import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateEducationOrganizationDto } from 'src/educationOrganization/dto/create-educationOrganization.dto';
import { EducationOrganization } from 'src/educationOrganization/educationOrganization.model';
import { EducationOrganizationService } from 'src/educationOrganization/educationOrganization.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { Education } from './education.model';
import { Op } from 'sequelize';

@Injectable()
export class EducationService {
  constructor(
    @InjectModel(Education)
    private readonly educationRepository: typeof Education,
    private readonly educationOrganizationService: EducationOrganizationService,
  ) {}

  async upsert(resumeId: number, dto: CreateEducationDto): Promise<Education> {
    try {
      const educationOrganization: CreateEducationOrganizationDto = {
        name: dto.educationOrganization.name,
        type: dto.educationOrganization.type,
      };

      let upsertedEducationOrganization: EducationOrganization;
      if (educationOrganization.name)
        upsertedEducationOrganization =
          await this.educationOrganizationService.findOrCreate(
            educationOrganization,
          );

      const [upsertedEducation] = await this.educationRepository.upsert({
        ...dto,
        resumeId,
        educationOrganizationId: upsertedEducationOrganization?.id,
      });

      return upsertedEducation;
    } catch (e) {
      console.log(e);
    }
  }

  async upsertMany(
    resumeId: number,
    dto: CreateEducationDto[],
  ): Promise<Education[]> {
    try {
      return Promise.all(dto.map((ed) => this.upsert(resumeId, ed)));
    } catch (e) {
      console.log(e);
    }
  }

  async deleteMany(ids: number[]) {
    return this.educationRepository.destroy({
      where: { id: { [Op.in]: ids } },
    });
  }
}
