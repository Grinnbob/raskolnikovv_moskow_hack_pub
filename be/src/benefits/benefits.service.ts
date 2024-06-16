import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Benefit } from './benefits.model';
import { CreateBenefitDto } from './dto/create-benefit.dto';

@Injectable()
export class BenefitsService {
  constructor(
    @InjectModel(Benefit) private benefitRepository: typeof Benefit,
  ) {}

  
  
  
  

  
  
  
  
  

  async findOrCreate(
    dto: CreateBenefitDto,
    transactionHost?: { transaction: any },
  ): Promise<Benefit> {
    let skill = await this.benefitRepository.findOne({
      where: { title: { [Op.iLike]: dto.title } },
      ...transactionHost,
    });

    if (!skill)
      skill = await this.benefitRepository.create(dto, transactionHost);
    return skill;
  }

  async findOrCreateMany(
    dtos: CreateBenefitDto[],
    transactionHost?: { transaction: any },
  ): Promise<Benefit[]> {
    return Promise.all(
      dtos.map((dto) => this.findOrCreate(dto, transactionHost)),
    );
  }

  async getAll(): Promise<Benefit[]> {
    return this.benefitRepository.findAll();
  }
}
