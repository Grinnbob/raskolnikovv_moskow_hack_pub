import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './category.model';
import { Op } from 'sequelize';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category) private categoryRepository: typeof Category,
  ) {}

  async findOrCreate(
    dto: CreateCategoryDto,
    transactionHost?: { transaction: any },
  ): Promise<Category> {
    let category = await this.categoryRepository.findOne({
      where: { title: { [Op.iLike]: dto.title } },
      ...transactionHost,
    });

    if (!category)
      category = await this.categoryRepository.create(dto, transactionHost);
    return category;
  }

  async upsert(dto: CreateCategoryDto): Promise<Category> {
    const [result] = await this.categoryRepository.upsert(dto);
    return result;
  }

  async getAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }
}
