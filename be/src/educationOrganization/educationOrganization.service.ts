import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateEducationOrganizationDto } from './dto/create-educationOrganization.dto';
import { EducationOrganization } from './educationOrganization.model';
import { Op } from 'sequelize';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class EducationOrganizationService {
  constructor(
    @InjectModel(EducationOrganization)
    private educationOrganizationRepository: typeof EducationOrganization,
    private readonly fileService: FilesService,
  ) {}

  async findOrCreate(
    dto: CreateEducationOrganizationDto,
  ): Promise<EducationOrganization> {
    const educationOrganization =
      await this.educationOrganizationRepository.findOne({
        where: {
          [Op.or]: [
            { name: { [Op.iLike]: '%' + dto.name + '%' } },
            { shortName: { [Op.iLike]: '%' + dto.name + '%' } },
          ],
        },
      });

    if (!educationOrganization) {
      return this.educationOrganizationRepository.create(dto);
    } else if (educationOrganization.type !== dto.type) {
      const updateResult = await this.educationOrganizationRepository.update(
        dto,
        { where: { id: educationOrganization.id }, returning: true },
      );
      return updateResult[1][0];
    }

    return educationOrganization;
  }

  async getAll(): Promise<EducationOrganization[]> {
    return this.educationOrganizationRepository.findAll();
  }

  async upsert(
    educationOrganization: CreateEducationOrganizationDto,
  ): Promise<EducationOrganization> {
    const [upsertedEducationOrganization] =
      await this.educationOrganizationRepository.upsert(educationOrganization);
    return upsertedEducationOrganization;
  }

  async upsertImage(
    id: number,
    image: Express.Multer.File,
  ): Promise<EducationOrganization> {
    const educationOrganization =
      await this.educationOrganizationRepository.findByPk(id);
    const oldImageName = educationOrganization.imageName;
    const imageName = await this.fileService.upsert(
      image,
      'images/educationOrganization',
      id + '_',
      oldImageName,
    );

    const result = await this.educationOrganizationRepository.update(
      { imageName },
      { where: { id }, returning: true },
    );

    return result[1][0];
  }

  async deleteImage(
    id: number,
    imageName?: string,
  ): Promise<EducationOrganization> {
    if (imageName)
      await this.fileService.delete(imageName, 'images/educationOrganization');
    else {
      const educationOrganization =
        await this.educationOrganizationRepository.findByPk(id);
      await this.fileService.delete(
        educationOrganization.imageName,
        'images/educationOrganization',
      );
    }

    const result = await this.educationOrganizationRepository.update(
      { imageName: null },
      { where: { id }, returning: true },
    );
    return result[1][0];
  }
}
