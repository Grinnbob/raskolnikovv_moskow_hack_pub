import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles-guard';
import { CreateEducationOrganizationDto } from './dto/create-educationOrganization.dto';
import { EducationOrganization } from './educationOrganization.model';
import { EducationOrganizationService } from './educationOrganization.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from 'src/utils/constants';

@ApiTags('EducationOrganization')
@Controller('educationOrganization')
export class EducationOrganizationController {
  constructor(
    private educationOrganizationService: EducationOrganizationService,
  ) {}

  @ApiOperation({ summary: 'Create educationOrganization' })
  @ApiResponse({ status: 200, type: EducationOrganization })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post()
  create(
    @Body() educationOrganizationDto: CreateEducationOrganizationDto,
  ): Promise<EducationOrganization> {
    return this.educationOrganizationService.findOrCreate(
      educationOrganizationDto,
    );
  }

  @ApiOperation({ summary: 'Get educationOrganizations' })
  @ApiResponse({ status: 200, type: [EducationOrganization] })
  @Get()
  getAll() {
    return this.educationOrganizationService.getAll();
  }

  @ApiOperation({ summary: 'Upsert image' })
  @ApiResponse({ status: 200, type: EducationOrganization })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('image')
  upsertImage(
    @Body() data: { id: string },
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({
            fileType: ALLOWED_FILE_TYPES,
          }),
        ],
      }),
    )
    image: Express.Multer.File,
  ) {
    const id = parseInt(data.id);
    if (isNaN(id))
      throw new HttpException(
        `Wrong id provided: ${data.id}`,
        HttpStatus.BAD_REQUEST,
      );

    return this.educationOrganizationService.upsertImage(id, image);
  }

  @ApiOperation({ summary: 'Delete image' })
  @ApiResponse({ status: 200, type: EducationOrganization })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete('image')
  deleteImage(@Body() data: { id: number; imageName?: string }) {
    return this.educationOrganizationService.deleteImage(
      data.id,
      data.imageName,
    );
  }
}
