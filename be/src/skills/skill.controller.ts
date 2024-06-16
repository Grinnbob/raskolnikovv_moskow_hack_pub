import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Skill } from './skill.model';
import { SkillService } from './skill.service';

@Controller('skill')
export class SkillController {
  constructor(private skillService: SkillService) {}

  @ApiOperation({ summary: 'Get all skills' })
  @ApiResponse({ status: 200, type: [Skill] })
  @Get()
  getAll() {
    return this.skillService.getAll();
  }
}
