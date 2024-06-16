import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateSkillDto } from './dto/create-skill.dto';
import { Skill } from './skill.model';
import { Op } from 'sequelize';
import { VacancySkill } from './vacancy-skill.model';
import { Resume } from 'src/resume/resume.model';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { ResumeSkill } from './resume-skill.model';

@Injectable()
export class SkillService {
  constructor(
    @InjectModel(Skill) private skillRepository: typeof Skill,
    @InjectModel(ResumeSkill)
    private readonly resumeSkillsRepository: typeof ResumeSkill,
    @InjectModel(VacancySkill)
    private readonly vacancySkillsRepository: typeof VacancySkill,
  ) {}

  async getAll(): Promise<Skill[]> {
    return this.skillRepository.findAll();
  }

  async findOrCreateMany(dtos: CreateSkillDto[]): Promise<Skill[]> {
    return Promise.all(dtos.map((dto) => this.findOrCreate(dto)));
  }

  async findOrCreate(
    dto: CreateSkillDto,
    transactionHost?: { transaction: any },
  ): Promise<Skill> {
    const skillData = { title: dto.title };
    let skill = await this.skillRepository.findOne({
      where: { title: { [Op.iLike]: skillData.title } },
    });

    if (!skill)
      skill = await this.skillRepository.create(skillData, transactionHost);

    return skill.dataValues;
  }

  public async upsertRelations(
    entity: Resume | Vacancy,
    entityType: 'resume' | 'vacancy',
    skillDtos: CreateSkillDto[],
    transactionHost?: { transaction: any },
  ): Promise<Skill[]> {
    if (skillDtos?.length) {
      await this.deleteRelations(entity.id, entityType, transactionHost); 
      return Promise.all(
        skillDtos.map((languageDto) =>
          this.upsertRelation(entity, entityType, languageDto, transactionHost),
        ),
      );
    }
  }

  private async upsertRelation(
    entity: Resume | Vacancy,
    entityType: 'resume' | 'vacancy',
    skillDto: CreateSkillDto,
    transactionHost?: { transaction: any },
  ): Promise<Skill> {
    const skill = await this.findOrCreate(skillDto, transactionHost);
    await entity.$add('skills', skill.id, transactionHost); 

    if (entityType === 'vacancy')
      await this.vacancySkillsRepository.update(
        { level: skillDto.level },
        {
          where: { vacancyId: entity.id, skillId: skill.id },
          returning: true,
          ...transactionHost,
        },
      );
    if (entityType === 'resume')
      await this.resumeSkillsRepository.update(
        { level: skillDto.level },
        {
          where: { resumeId: entity.id, skillId: skill.id },
          returning: true,
          ...transactionHost,
        },
      );

    return skill;
  }

  private async deleteRelations(
    entityId: number,
    entityType: 'resume' | 'vacancy',
    transactionHost?: { transaction: any },
  ) {
    if (entityType === 'resume') {
      return this.resumeSkillsRepository.destroy({
        where: { resumeId: entityId },
        ...transactionHost,
      });
    } else if (entityType === 'vacancy') {
      return this.vacancySkillsRepository.destroy({
        where: { vacancyId: entityId },
        ...transactionHost,
      });
    }
  }
}
