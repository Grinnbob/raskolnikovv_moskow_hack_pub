import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { Resume } from 'src/resume/resume.model';
import { CategoryController } from './category.controller';
import { Category } from './category.model';
import { CategoryService } from './category.service';
import { PinoLoggerModule } from 'src/logger/logger.module';

@Module({
  providers: [CategoryService],
  controllers: [CategoryController],
  imports: [
    SequelizeModule.forFeature([Category, Vacancy, Resume]),
    forwardRef(() => AuthModule),
    PinoLoggerModule,
  ],
})
export class CategoryModule {}
