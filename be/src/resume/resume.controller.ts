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
import { RolesGuard } from 'src/auth/roles-guard';
import { Resume } from './resume.model';
import { ResumeService } from './resume.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PaginatedResponse } from 'src/utils/interfaces';
import { CreateResumeDto } from './dto/create-resume.dto';
import { validatePagesQuery } from 'src/utils/utils';
import { CreateSkillDto } from 'src/skills/dto/create-skill.dto';
import { Skill } from 'src/skills/skill.model';
import { FileInterceptor } from '@nestjs/platform-express';
import { MAX_FILE_SIZE, ALLOWED_FILE_TYPES } from 'src/utils/constants';
import { Roles } from 'src/auth/roles-auth.decorator';

@ApiTags('Resume')
@Controller('resume')
export class ResumeController {
  constructor(private resumeService: ResumeService) {}

  @ApiOperation({ summary: 'Upsert resume' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post()
  upsert(@Body() dto: CreateResumeDto, @Req() req): Promise<Resume> {
    return this.resumeService.upsert(req.user.id, dto);
  }

  @ApiOperation({ summary: 'Upsert resume skills' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/skills')
  upsertSkills(
    @Body() data: { id: number; skills: CreateSkillDto[] },
  ): Promise<Skill[]> {
    return this.resumeService.upsertSkills(data.id, data.skills);
  }

  @ApiOperation({ summary: 'Get resume by id' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/')
  get(@Query() query: { id: number }): Promise<Resume> {
    const id = parseInt(query?.id as any);
    if (isNaN(id))
      throw new HttpException(
        `Wrong resume id provided: ${query?.id}`,
        HttpStatus.BAD_REQUEST,
      );

    return this.resumeService.get(id);
  }

  @ApiOperation({ summary: 'Get my resume' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/my')
  getAllMy(@Req() req): Promise<Resume[]> {
    return this.resumeService.getAllMy(req.user.id);
  }

  @ApiOperation({ summary: 'Get list of paginated resume' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/list')
  getPaginatedAll(
    @Query() query: { page: string; pageSize?: string },
  ): Promise<PaginatedResponse<Resume>> {
    const { page, pageSize } = validatePagesQuery(query);
    return this.resumeService.getPaginatedAll(page, pageSize, query);
  }

  @ApiOperation({ summary: 'Delete resume' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete()
  delete(@Body() data: { id: number }, @Req() req) {
    return this.resumeService.delete(data.id, req.user.id, req.user.role);
  }

  @ApiOperation({ summary: 'Like resume' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/like')
  setLike(@Body() data: { id: number }, @Req() req) {
    return this.resumeService.setLike(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'Unlike resume' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/unlike')
  deleteLike(@Body() data: { id: number }, @Req() req) {
    return this.resumeService.deleteLike(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'Like resume comment' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/comment/like')
  setCommentLike(@Body() data: { id: number }, @Req() req) {
    return this.resumeService.setCommentLike(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'Unlike resume comment' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/comment/unlike')
  deleteCommentLike(@Body() data: { id: number }, @Req() req) {
    return this.resumeService.deleteCommentLike(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'Activate resume' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/activate')
  activate(@Body() data: { id: number }, @Req() req) {
    return this.resumeService.changeIsActive(
      data.id,
      true,
      req.user.id,
      req.user.role,
    );
  }

  @ApiOperation({ summary: 'Deactivate resume' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/deactivate')
  deactivate(@Body() data: { id: number }, @Req() req) {
    return this.resumeService.changeIsActive(
      data.id,
      false,
      req.user.id,
      req.user.role,
    );
  }

  @ApiOperation({ summary: 'View resume' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/view')
  setView(@Body() data: { id: number }, @Req() req) {
    return this.resumeService.setView(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'Respond resume' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/respond')
  setRespond(@Body() data: { id: number }, @Req() req) {
    return this.resumeService.setRespond(data.id, req.user.id);
  }

  @ApiOperation({ summary: 'Create resume complaint' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/complaint')
  createComplaint(
    @Body() data: { id: number; description?: string },
    @Req() req,
  ) {
    return this.resumeService.createComplaint(
      data.id,
      req.user.id,
      data.description,
    );
  }

  @ApiOperation({ summary: 'Get resume complaints' })
  @ApiResponse({ status: 200, type: Resume })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/complaints')
  getComplaints() {
    return this.resumeService.getComplaints();
  }

  @ApiOperation({ summary: 'Ban resume' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch('/ban')
  banResume(@Body() data: { id: number; banReason?: string | null }) {
    return this.resumeService.banResume(data.id, data?.banReason);
  }

  @ApiOperation({ summary: 'Unban resume' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch('/unban')
  unbanResume(@Body() data: { id: number }) {
    return this.resumeService.unbanResume(data.id);
  }

  @ApiOperation({ summary: 'Ban all resume by userId' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch('/ban/all')
  banUserResume(@Body() data: { userId: number; banReason?: string | null }) {
    return this.resumeService.banUserResume(data.userId, data?.banReason);
  }

  @ApiOperation({ summary: 'Create resume comment' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/comment')
  createComment(@Body() data: { id: number; message: string }, @Req() req) {
    return this.resumeService.createComment(data.id, req.user.id, data.message);
  }

  @ApiOperation({ summary: 'Update resume comment' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch('/comment')
  updateComment(@Body() data: { id: number; message: string }, @Req() req) {
    return this.resumeService.updateComment(
      data.id,
      req.user.id,
      req.user.role,
      data.message,
    );
  }

  @ApiOperation({ summary: 'Delete resume comment' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete('/comment')
  deleteComment(@Body() data: { id: number }, @Req() req) {
    return this.resumeService.deleteComment(
      data.id,
      req.user.id,
      req.user.role,
    );
  }

  @ApiOperation({ summary: 'Get list of paginated my resume reactions' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/my/reactions/list')
  getPaginatedMyReactions(
    @Req() req,
    @Query() query: { page: string; pageSize?: string; reactionType: string },
  ): Promise<PaginatedResponse<Resume>> {
    if (
      !query?.reactionType ||
      !['likes', 'responds', 'views'].includes(query.reactionType)
    )
      throw new HttpException(
        `Wrong reactionType provided ('likes' | 'responds' | 'viewes' allowed only): ${query.reactionType}`,
        HttpStatus.BAD_REQUEST,
      );

    const { page, pageSize } = validatePagesQuery(query);
    return this.resumeService.getPaginatedMyReactions(
      query.reactionType as any,
      req.user.id,
      page,
      pageSize,
    );
  }

  @ApiOperation({ summary: 'View resume reaction' })
  @ApiResponse({ status: 200, type: Resume })
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
      return this.resumeService.setLikeViewed(data.id, data.userId);
    if (data.reactionType === 'respond')
      return this.resumeService.setRespondViewed(data.id, data.userId);
    if (data.reactionType === 'view')
      return this.resumeService.setViewViewed(data.id, data.userId);

    throw new HttpException(
      `Wrong reactionType provided ('like' | 'respond' | 'view' allowed only): ${data.reactionType}`,
      HttpStatus.BAD_REQUEST,
    );
  }

  @ApiOperation({ summary: 'Upsert resume image' })
  @ApiResponse({ status: 200, type: Resume })
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

    return this.resumeService.upsertImage(id, image);
  }

  @ApiOperation({ summary: 'Delete resume image' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete('image')
  deleteImage(@Body() data: { id: number; imageName?: string }) {
    return this.resumeService.deleteImage(data.id, data.imageName);
  }

  @ApiOperation({ summary: 'Get resume pdf' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/pdf')
  createPDF(@Query() query: { id: number }): Promise<string> {
    const id = parseInt(query?.id as any);
    if (isNaN(id))
      throw new HttpException(
        `Wrong resume id provided: ${query?.id}`,
        HttpStatus.BAD_REQUEST,
      );

    return this.resumeService.createPDF(id);
  }

  @ApiOperation({ summary: 'Get resume docx' })
  @ApiResponse({ status: 200, type: Resume })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/docx')
  createDOCX(@Query() query: { id: number }): Promise<string> {
    const id = parseInt(query?.id as any);
    if (isNaN(id))
      throw new HttpException(
        `Wrong resume id provided: ${query?.id}`,
        HttpStatus.BAD_REQUEST,
      );

    return this.resumeService.createDOCX(id);
  }

  @ApiOperation({ summary: 'Delete all files (docx, pdf)' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Delete('/files')
  deleteFiles() {
    return this.resumeService.deleteAllFiles();
  }
}
