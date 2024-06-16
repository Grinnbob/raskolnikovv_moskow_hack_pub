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
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles-guard';
import { CreateVacancyDto } from './dto/create-vacancy.dto';
import { Vacancy } from './vacancy.model';
import { VacancyService } from './vacancy.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Benefit } from 'src/benefits/benefits.model';
import { PaginatedResponse } from 'src/utils/interfaces';
import { validatePagesQuery } from 'src/utils/utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from 'src/utils/constants';
import { CreateCompanyDto } from 'src/company/dto/create-company.dto';
import { Company } from 'src/company/company.model';
import { CreateSkillDto } from 'src/skills/dto/create-skill.dto';
import { Skill } from 'src/skills/skill.model';

@ApiTags('Vacancy')
@Controller('vacancy')
export class VacancyController {
  constructor(private vacancyService: VacancyService) {}

  @ApiOperation({ summary: 'Get vacancy' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get()
  get(@Query() query: { id: number }): Promise<Vacancy> {
    const id = parseInt(query?.id as any);
    if (isNaN(id))
      throw new HttpException(
        `Wrong vacancy id provided: ${query?.id}`,
        HttpStatus.BAD_REQUEST,
      );
    return this.vacancyService.get(id);
  }

  @ApiOperation({ summary: 'Get my vacancies' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/my')
  getAll(@Req() req): Promise<Vacancy[]> {
    return this.vacancyService.getAllByUserId(req.user.id);
  }

  @ApiOperation({ summary: 'Get user vacancies' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/user')
  getUser(@Query() query: { userId: number }): Promise<Vacancy[]> {
    const id = parseInt(query?.userId as any);
    if (isNaN(id))
      throw new HttpException(
        `Wrong userId provided: ${query?.userId}`,
        HttpStatus.BAD_REQUEST,
      );
    return this.vacancyService.getAllByUserId(id);
  }

  @ApiOperation({ summary: 'Get company vacancies' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/company')
  getCompany(@Query() query: { companyId: number }): Promise<Vacancy[]> {
    const id = parseInt(query?.companyId as any);
    if (isNaN(id))
      throw new HttpException(
        `Wrong companyId provided: ${query?.companyId}`,
        HttpStatus.BAD_REQUEST,
      );
    return this.vacancyService.getAllByCompanyId(id);
  }

  @ApiOperation({ summary: 'Get list of paginated vacancies' })
  @ApiResponse({ status: 200, type: Vacancy })
  @Get('/list')
  getPaginatedAll(
    @Query()
    query: {
      page: string;
      pageSize?: string;
    },
  ): Promise<PaginatedResponse<Vacancy>> {
    const { page, pageSize } = validatePagesQuery(query);
    return this.vacancyService.getPaginatedAll(page, pageSize, query);
  }

  @ApiOperation({ summary: 'Get list of paginated my vacancies reactions' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/my/reactions/list')
  getPaginatedMyReactions(
    @Req() req,
    @Query() query: { page: string; pageSize?: string; reactionType: string },
  ): Promise<PaginatedResponse<Vacancy>> {
    if (
      !query?.reactionType ||
      !['likes', 'responds', 'views'].includes(query.reactionType)
    )
      throw new HttpException(
        `Wrong reactionsType provided: ${query.reactionType}`,
        HttpStatus.BAD_REQUEST,
      );

    const { page, pageSize } = validatePagesQuery(query);
    return this.vacancyService.getPaginatedMyReactions(
      query.reactionType as any,
      req.user.id,
      page,
      pageSize,
    );
  }

  @ApiOperation({ summary: 'Create vacancy' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post()
  create(@Body() vacancyDto: CreateVacancyDto, @Req() req): Promise<Vacancy> {
    return this.vacancyService.upsert(
      req.user.id,
      req.user.financeAccountId,
      req.user.role,
      vacancyDto,
      'create',
    );
  }

  @ApiOperation({ summary: 'Update vacancy' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch()
  update(@Body() vacancyDto: CreateVacancyDto, @Req() req): Promise<Vacancy> {
    return this.vacancyService.upsert(
      req.user.id,
      req.user.financeAccountId,
      req.user.role,
      vacancyDto,
      'update',
    );
  }

  @ApiOperation({ summary: 'Upsert vacancy skills' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/skills')
  upsertSkills(
    @Body() data: { id: number; skills: CreateSkillDto[] },
  ): Promise<Skill[]> {
    return this.vacancyService.upsertSkills(data.id, data.skills);
  }

  @ApiOperation({ summary: 'Upsert vacancy company' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('company')
  upsertCompany(
    @Body() data: { vacancyId: number; company: CreateCompanyDto },
    @Req() req,
  ): Promise<Company> {
    return this.vacancyService.upsertCompany(
      req.user.id,
      data.vacancyId,
      data.company,
    );
  }

  @ApiOperation({ summary: 'Upsert vacancy image' })
  @ApiResponse({ status: 200, type: Vacancy })
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

    return this.vacancyService.upsertImage(id, image);
  }

  @ApiOperation({ summary: 'Delete vacancy image' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete('image')
  deleteImage(@Body() data: { id: number; imageName?: string }) {
    return this.vacancyService.deleteImage(data.id, data.imageName);
  }

  @ApiOperation({ summary: 'Delete vacancy' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete()
  delete(@Body() data: { id: number }, @Req() req) {
    return this.vacancyService.delete(data.id, req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Like vacancy' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/like')
  setLike(@Body() data: { id: number }, @Req() req) {
    return this.vacancyService.setLike(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'Unlike vacancy' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/unlike')
  deleteLike(@Body() data: { id: number }, @Req() req) {
    return this.vacancyService.deleteLike(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'Like vacancy comment' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/comment/like')
  setCommentLike(@Body() data: { id: number }, @Req() req) {
    return this.vacancyService.setCommentLike(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'Unlike vacancy comment' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/comment/unlike')
  deleteCommentLike(@Body() data: { id: number }, @Req() req) {
    return this.vacancyService.deleteCommentLike(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'Activate vacancy' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/activate')
  activate(@Body() data: { id: number }, @Req() req) {
    return this.vacancyService.changeIsActive(
      data.id,
      true,
      req.user.id,
      req.user.role,
    );
  }

  @ApiOperation({ summary: 'Deactivate vacancy' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/deactivate')
  deactivate(@Body() data: { id: number }, @Req() req) {
    return this.vacancyService.changeIsActive(
      data.id,
      false,
      req.user.id,
      req.user.role,
    );
  }

  @ApiOperation({ summary: 'Delete vacancy benefits' })
  @ApiResponse({ status: 200, type: Benefit })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete('/benefits')
  deleteBenefits(@Body() data: { vacancyId: number; benefitIds: number[] }) {
    return this.vacancyService.deleteVacancyBenefits(
      data.vacancyId,
      data.benefitIds,
    );
  }

  @ApiOperation({ summary: 'View vacancy' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/view')
  setView(@Body() data: { id: number }, @Req() req) {
    return this.vacancyService.setView(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'Respond vacancy' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/respond')
  setRespond(@Body() data: { id: number }, @Req() req) {
    return this.vacancyService.setRespond(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'View vacancy reaction' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/respond/viewed')
  setReactionViewed(
    @Body()
    data: {
      id: number;
      userId: number;
      reactionType: 'like' | 'respond' | 'view';
    },
  ) {
    if (data.reactionType === 'like')
      return this.vacancyService.setLikeViewed(data.id, data.userId);
    if (data.reactionType === 'respond')
      return this.vacancyService.setRespondViewed(data.id, data.userId);
    if (data.reactionType === 'view')
      return this.vacancyService.setViewViewed(data.id, data.userId);

    throw new HttpException(
      `Wrong reactionType provided ('like' | 'respond' | 'view' allowed only): ${data.reactionType}`,
      HttpStatus.BAD_REQUEST,
    );
  }

  @ApiOperation({ summary: 'Create vacancy complaint' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/complaint')
  createComplaint(
    @Body() data: { id: number; description?: string | null },
    @Req() req,
  ) {
    return this.vacancyService.createComplaint(
      data.id,
      req.user.id,
      data.description,
    );
  }

  @ApiOperation({ summary: 'Get vacancy complaints' })
  @ApiResponse({ status: 200, type: Vacancy })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/complaints')
  getComplaints() {
    return this.vacancyService.getComplaints();
  }

  @ApiOperation({ summary: 'Ban vacancy' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch('/ban')
  banVacancy(@Body() data: { id: number; banReason?: string | null }) {
    return this.vacancyService.banVacancy(data.id, data?.banReason);
  }

  @ApiOperation({ summary: 'Unban vacancy' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch('/unban')
  unbanVacancy(@Body() data: { id: number }) {
    return this.vacancyService.unbanVacancy(data.id);
  }

  @ApiOperation({ summary: 'Ban all vacancies by userId' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch('/ban/all')
  banUserVacancies(
    @Body() data: { userId: number; banReason?: string | null },
  ) {
    return this.vacancyService.banUserVacancies(data.userId, data?.banReason);
  }

  @ApiOperation({ summary: 'Create vacancy comment' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/comment')
  createComment(@Body() data: { id: number; message: string }, @Req() req) {
    return this.vacancyService.createComment(
      data.id,
      req.user.id,
      data.message,
    );
  }

  @ApiOperation({ summary: 'Update vacancy comment' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch('/comment')
  updateComment(@Body() data: { id: number; message: string }, @Req() req) {
    return this.vacancyService.updateComment(
      data.id,
      req.user.id,
      req.user.role,
      data.message,
    );
  }

  @ApiOperation({ summary: 'Delete vacancy comment' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete('/comment')
  deleteComment(@Body() data: { id: number }, @Req() req) {
    return this.vacancyService.deleteComment(
      data.id,
      req.user.id,
      req.user.role,
    );
  }

  @ApiOperation({ summary: 'Get vacancy pdf' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/pdf')
  createPDF(@Query() query: { id: number }): Promise<string> {
    const id = parseInt(query?.id as any);
    if (isNaN(id))
      throw new HttpException(
        `Wrong vacancy id provided: ${query?.id}`,
        HttpStatus.BAD_REQUEST,
      );

    return this.vacancyService.createPDF(id);
  }

  @ApiOperation({ summary: 'Get vacancy docx' })
  @ApiResponse({ status: 200, type: Vacancy })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/docx')
  createDOCX(@Query() query: { id: number }): Promise<string> {
    const id = parseInt(query?.id as any);
    if (isNaN(id))
      throw new HttpException(
        `Wrong vacancy id provided: ${query?.id}`,
        HttpStatus.BAD_REQUEST,
      );

    return this.vacancyService.createDOCX(id);
  }

  @ApiOperation({ summary: 'Delete all files (docx, pdf)' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete('/files')
  deleteFiles() {
    return this.vacancyService.deleteAllFiles();
  }
}
