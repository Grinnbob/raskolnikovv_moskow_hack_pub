import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles-guard';
import { CreateLanguageDto } from './dto/create-language.dto';
import { Language } from './language.model';
import { LanguageService } from './language.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Language')
@Controller('language')
export class LanguageController {
  constructor(private languageService: LanguageService) {}

  @ApiOperation({ summary: 'Create language' })
  @ApiResponse({ status: 200, type: Language })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post()
  upsert(@Body() languageDto: CreateLanguageDto): Promise<Language> {
    return this.languageService.upsert(languageDto);
  }

  @ApiOperation({ summary: 'Get languages' })
  @ApiResponse({ status: 200, type: [Language] })
  @Get()
  getAll() {
    return this.languageService.getAll();
  }
}
