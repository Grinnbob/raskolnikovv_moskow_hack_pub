import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles-guard';
import { CreateEducationDto } from './dto/create-education.dto';
import { Education } from './education.model';
import { EducationService } from './education.service';

@Controller('education')
export class EducationController {
  constructor(private educationService: EducationService) {}

  @ApiOperation({ summary: 'Upsert education' })
  @ApiResponse({ status: 200, type: Education })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post()
  upsertMany(
    @Body() dto: { resumeId: number; educations: CreateEducationDto[] },
  ) {
    return this.educationService.upsertMany(dto.resumeId, dto.educations);
  }

  @ApiOperation({ summary: 'Delete education' })
  @ApiResponse({ status: 200, type: Education })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete()
  delete(@Body() ids: number[]) {
    return this.educationService.deleteMany(ids);
  }
}
