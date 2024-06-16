import { Controller, Get } from '@nestjs/common';
import { BenefitsService } from './benefits.service';
import { Benefit } from './benefits.model';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('benefits')
export class BenefitsController {
  constructor(private benefitService: BenefitsService) {}

  @ApiOperation({ summary: 'Get all benefits' })
  @ApiResponse({ status: 200, type: [Benefit] })
  @Get()
  getAll() {
    return this.benefitService.getAll();
  }
}
