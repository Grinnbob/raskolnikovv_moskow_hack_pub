import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles-guard';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './category.model';
import { CategoryService } from './category.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 200, type: Category })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post()
  upsert(@Body() categoryDto: CreateCategoryDto): Promise<Category> {
    return this.categoryService.upsert(categoryDto);
  }

  @ApiOperation({ summary: 'Get categories' })
  @ApiResponse({ status: 200, type: [Category] })
  @Get()
  getAll() {
    return this.categoryService.getAll();
  }
}
