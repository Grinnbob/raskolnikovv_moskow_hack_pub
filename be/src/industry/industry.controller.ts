import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles-guard';
import { CreateIndustryDto } from './dto/create-industry.dto';
import { Industry } from './industry.model';
import { IndustryService } from './industry.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Industry')
@Controller('industry')
export class IndustryController {
  constructor(private industryService: IndustryService) {}

  @ApiOperation({ summary: 'Create industry' })
  @ApiResponse({ status: 200, type: Industry })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post()
  upsert(@Body() industryDto: CreateIndustryDto): Promise<Industry> {
    return this.industryService.upsert(industryDto);
  }

  @ApiOperation({ summary: 'Get industries' })
  @ApiResponse({ status: 200, type: [Industry] })
  @Get()
  getAll() {
    return this.industryService.getAll();
  }

  @ApiOperation({ summary: 'Delete resume industries' })
  @ApiResponse({ status: 200, type: Industry })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete('/resume')
  deleteResumeIndustries(
    @Body() data: { resumeId: number; industryIds: number[] },
  ) {
    return this.industryService.deleteResumeIndustries(
      data.resumeId,
      data.industryIds,
    );
  }

  @ApiOperation({ summary: 'Delete company industries' })
  @ApiResponse({ status: 200, type: Industry })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete('/company')
  deleteCompanyIndustries(
    @Body() data: { companyId: number; industryIds: number[] },
  ) {
    return this.industryService.deleteCompanyIndustries(
      data.companyId,
      data.industryIds,
    );
  }
}
