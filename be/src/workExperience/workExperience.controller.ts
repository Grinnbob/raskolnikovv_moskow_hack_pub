import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles-guard';
import { CreateWorkExperienceDto } from './dto/create-workExperience.dto';
import { WorkExperience } from './workExperience.model';
import { WorkExperienceService } from './workExperience.service';

@Controller('workExperience')
export class WorkExperienceController {
  constructor(private workExperienceService: WorkExperienceService) {}

  @ApiOperation({ summary: 'Add or update WorkExperience' })
  @ApiResponse({ status: 200, type: WorkExperience })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post()
  upsertMany(
    @Body()
    dto: {
      resumeId: number;
      workExperiences: CreateWorkExperienceDto[];
    },
  ) {
    return this.workExperienceService.upsertMany(
      dto.resumeId,
      dto.workExperiences,
    );
  }

  @ApiOperation({ summary: 'Delete WorkExperiences' })
  @ApiResponse({ status: 200, type: WorkExperience })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete()
  delete(@Body() ids: number[]) {
    return this.workExperienceService.deleteMany(ids);
  }
}
