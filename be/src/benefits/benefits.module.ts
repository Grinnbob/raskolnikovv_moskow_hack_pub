import { forwardRef, Module } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { BenefitsController } from './benefits.controller';
import { Benefit } from './benefits.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { Vacancy } from 'src/vacancy/vacancy.model';
import { VacancyBenefit } from './vacancy-benefits.model';
import { FilesModule } from 'src/files/files.module';
import { PinoLoggerModule } from 'src/logger/logger.module';

@Module({
  providers: [BenefitsService],
  controllers: [BenefitsController],
  imports: [
    SequelizeModule.forFeature([Benefit, Vacancy, VacancyBenefit]),
    forwardRef(() => AuthModule),
    FilesModule,
    PinoLoggerModule,
  ],
  exports: [BenefitsService],
})
export class BenefitsModule {}
