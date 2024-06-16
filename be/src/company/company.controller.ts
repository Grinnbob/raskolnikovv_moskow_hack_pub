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
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/roles-guard';
import { CreateCompanyDto } from './dto/create-company.dto';
import { Company } from './company.model';
import { CompanyService } from './company.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginatedResponse } from 'src/utils/interfaces';
import { validatePagesQuery } from 'src/utils/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from 'src/utils/constants';
import { CompanyRatingDto } from './dto/create-company-rating.dto';
import { CompanyOwners } from './company-owners.model';
import { Roles } from 'src/auth/roles-auth.decorator';

@ApiTags('Company')
@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  
  @ApiOperation({ summary: 'Upsert company' })
  @ApiResponse({ status: 200, type: Company })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post()
  upsert(@Body() companyDto: CreateCompanyDto, @Req() req): Promise<Company> {
    return this.companyService.upsert(req.user.id, companyDto);
  }

  @ApiOperation({ summary: 'Add owner to company' })
  @ApiResponse({ status: 200, type: CompanyOwners })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/add/owner')
  addOwner(
    @Body() data: { userId: number; companyId: number },
  ): Promise<CompanyOwners> {
    return this.companyService.addOwner(data.userId, data.companyId);
  }

  @ApiOperation({ summary: 'Get companies' })
  @ApiResponse({ status: 200, type: [Company] })
  @Get('/all')
  getAll() {
    return this.companyService.getAll();
  }

  @ApiOperation({ summary: 'Get list of paginated companies' })
  @ApiResponse({ status: 200, type: Company })
  @Get('/list')
  getPaginatedAll(
    @Query()
    query: {
      page: string;
      pageSize?: string;
    },
  ): Promise<PaginatedResponse<Company>> {
    const { page, pageSize } = validatePagesQuery(query);
    return this.companyService.getPaginatedAll(page, pageSize, query);
  }

  @ApiOperation({ summary: 'Get company by id' })
  @ApiResponse({ status: 200, type: Company })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get()
  get(@Query() query: { id: number }): Promise<Company> {
    const id = parseInt(query?.id as any);
    if (isNaN(id))
      throw new HttpException(
        `Wrong company id provided: ${query?.id}`,
        HttpStatus.BAD_REQUEST,
      );
    return this.companyService.get(id);
  }

  @ApiOperation({ summary: 'Get company by vacancy id' })
  @ApiResponse({ status: 200, type: Company })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/vacancy')
  getByVacancyId(@Query() query: { id: number }): Promise<Company> {
    const id = parseInt(query?.id as any);
    if (isNaN(id))
      throw new HttpException(
        `Wrong company id provided: ${query?.id}`,
        HttpStatus.BAD_REQUEST,
      );
    return this.companyService.getByVacancyId(id);
  }

  @ApiOperation({ summary: 'Upsert company rating' })
  @ApiResponse({ status: 200, type: Company })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/rating')
  upsertRating(@Body() data: CompanyRatingDto, @Req() req) {
    return this.companyService.upsertRating(
      data.id,
      req.user.id,
      data.rating,
      data.recall,
    );
  }

  @ApiOperation({ summary: 'Delete company rating' })
  @ApiResponse({ status: 200, type: Company })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete('/rating')
  deleteRating(@Body() data: { id: number }, @Req() req) {
    return this.companyService.deleteRating(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'Upsert company image' })
  @ApiResponse({ status: 200, type: Company })
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

    return this.companyService.upsertImage(id, image);
  }

  @ApiOperation({ summary: 'Delete company image' })
  @ApiResponse({ status: 200, type: Company })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete('image')
  deleteImage(@Body() data: { id: number; imageName?: string }) {
    return this.companyService.deleteImage(data.id, data.imageName);
  }
}
