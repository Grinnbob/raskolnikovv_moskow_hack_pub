import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateLanguageDto } from './dto/create-language.dto';
import { Language } from './language.model';
import { Op } from 'sequelize';
import { SkillLevel } from 'src/skills/resume-skill.model';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { LanguageProficiency, LanguageResume } from './language-resume.model';
import { LanguageVacancy } from './language-vacancy.model';
import { Resume } from 'src/resume/resume.model';

@Injectable()
export class LanguageService {
  constructor(
    @InjectModel(Language) private languageRepository: typeof Language,
    @InjectModel(LanguageVacancy)
    private readonly languageVacancyRepository: typeof LanguageVacancy,
    @InjectModel(LanguageResume)
    private readonly languageResumeRepository: typeof LanguageResume,
  ) {}

  async upsert(dto: CreateLanguageDto): Promise<Language> {
    const [result] = await this.languageRepository.upsert(dto);
    return result;
  }

  async getAll(): Promise<Language[]> {
    return this.languageRepository.findAll();
  }

  async findOrCreate(
    dto: CreateLanguageDto,
    transactionHost?: { transaction: any },
  ): Promise<Language> {
    const languageData = { title: dto.title };
    let language = await this.languageRepository.findOne({
      where: { title: { [Op.iLike]: languageData.title } },
      ...transactionHost,
    });

    if (!language)
      language = await this.languageRepository.create(
        languageData,
        transactionHost,
      );

    return language.dataValues;
  }

  public async upsertRelations(
    entity: Resume | Vacancy,
    entityType: 'resume' | 'vacancy',
    languageDtos: CreateLanguageDto[],
    transactionHost?: { transaction: any },
  ): Promise<Language[]> {
    if (languageDtos?.length) {
      await this.deleteRelations(entity.id, entityType, transactionHost); 
      return Promise.all(
        languageDtos.map((languageDto) =>
          this.upsertRelation(entity, entityType, languageDto, transactionHost),
        ),
      );
    }
  }

  private async upsertRelation(
    entity: Resume | Vacancy,
    entityType: 'resume' | 'vacancy',
    languageDto: CreateLanguageDto,
    transactionHost?: { transaction: any },
  ): Promise<Language> {
    const language = await this.findOrCreate(languageDto, transactionHost);
    await entity.$add('languages', language.id, transactionHost); 

    let level = languageDto.level;
    if (languageDto.proficiency) {
      switch (languageDto.proficiency) {
        case LanguageProficiency.A1:
        case LanguageProficiency.A2:
          level = SkillLevel.JUNIOR;
          break;

        case LanguageProficiency.B1:
        case LanguageProficiency.B2:
          level = SkillLevel.MIDDLE;
          break;

        case LanguageProficiency.C1:
        case LanguageProficiency.C2:
          level = SkillLevel.SENIOR;
          break;

        default:
          break;
      }
    }

    if (entityType === 'vacancy')
      await this.languageVacancyRepository.update(
        { level, proficiency: languageDto.proficiency },
        {
          where: { vacancyId: entity.id, languageId: language.id },
          returning: true,
          ...transactionHost,
        },
      );
    if (entityType === 'resume')
      await this.languageResumeRepository.update(
        { level, proficiency: languageDto.proficiency },
        {
          where: { resumeId: entity.id, languageId: language.id },
          returning: true,
          ...transactionHost,
        },
      );

    return language;
  }

  private async deleteRelations(
    entityId: number,
    entityType: 'resume' | 'vacancy',
    transactionHost?: { transaction: any },
  ) {
    if (entityType === 'resume') {
      return this.languageResumeRepository.destroy({
        where: { resumeId: entityId },
        ...transactionHost,
      });
    } else if (entityType === 'vacancy') {
      return this.languageVacancyRepository.destroy({
        where: { vacancyId: entityId },
        ...transactionHost,
      });
    }
  }
}
