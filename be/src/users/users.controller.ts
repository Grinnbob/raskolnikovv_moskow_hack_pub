import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Injectable,
  Patch,
  Post,
  Query,
  Req,
  Scope,
  UseGuards,
  
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RolesGuard } from 'src/auth/roles-guard';
import { AddInfoToUserDto } from './dto/add-info-to-user.dto';

import { AddRoleDto } from './dto/add-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserStatus } from './users.model';
import { UsersService } from './users.service';
import {
  PaginatedResponse,
  UserReactionWithDocument,
  UserReactionsCounts,
} from 'src/utils/interfaces';
import { validatePagesQuery } from 'src/utils/utils';

@ApiTags('Users')
@Controller('users')
@Injectable({ scope: Scope.REQUEST })
export class UsersController {
  constructor(private userService: UsersService) {}

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({ status: 200, type: User })
  @Post()
  
  create(@Body() userDto: CreateUserDto): Promise<User> {
    return this.userService.create(userDto);
  }

  @ApiOperation({ summary: 'Add user main info' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/add/mainInfo')
  addMainInfo(
    @Body() userInfoDto: AddInfoToUserDto,
    @Req() req,
  ): Promise<User> {
    return this.userService.addMainInfo(req.user.id, userInfoDto);
  }

  @ApiOperation({ summary: 'Get me' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/me')
  getMe(@Req() req) {
    return this.userService.getMe(req.user.id);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: User })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/all')
  getAll() {
    return this.userService.getAll();
  }

  @ApiOperation({ summary: 'Add role' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/role')
  addRole(@Body() dto: AddRoleDto) {
    return this.userService.addRole(dto);
  }

  @ApiOperation({ summary: 'Get all banned users' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/banned')
  getBanned() {
    return this.userService.getBanned();
  }

  @ApiOperation({ summary: 'Unban user' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch('/ban')
  ban(@Body() data: { id: number; banReason?: string }) {
    return this.userService.changeIsBanned(data.id, true, data.banReason);
  }

  @ApiOperation({ summary: 'Unban user' })
  @ApiResponse({ status: 200 })
  @Roles('ADMIN')
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch('/unban')
  unban(@Body() data: { id: number }) {
    return this.userService.changeIsBanned(data.id, false);
  }

  @ApiOperation({ summary: 'Check email validation code' })
  @ApiResponse({ status: 200 })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/verify/email')
  checkEmailValidationCode(
    @Req() req,
    @Body() data: { emailValidationCode: string },
  ) {
    return this.userService.checkEmailValidationCode(
      req.user.id,
      data.emailValidationCode,
    );
  }

  @ApiOperation({
    summary: 'Get list of paginated reactions on vacancies or resume',
  })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/reactions/list')
  getPaginatedUsersReactionsWithData(
    @Req() req,
    @Query()
    query: {
      page: string;
      pageSize?: string;
      model: string;
      reactionType: string;
    },
  ): Promise<PaginatedResponse<UserReactionWithDocument>> {
    const { page, pageSize } = validatePagesQuery(query);
    if (query?.model !== 'vacancy' && query?.model !== 'resume')
      throw new HttpException(
        `Wrong model provided ('vacancy' or 'resume' allowed only): ${query.model}`,
        HttpStatus.BAD_REQUEST,
      );
    if (
      query?.reactionType !== 'likes' &&
      query?.reactionType !== 'responds' &&
      query?.reactionType !== 'views'
    )
      throw new HttpException(
        `Wrong reactionType provided ('likes' or 'responds' or 'views' allowed only): ${query.reactionType}`,
        HttpStatus.BAD_REQUEST,
      );

    const model = query.model === 'vacancy' ? 'vacancies' : 'resume';
    const submodel = (query.model + '_' + query.reactionType) as any;

    return this.userService.getPaginatedUsersReactionsWithData(
      req.user.id,
      model,
      submodel,
      page,
      pageSize,
    );
  }

  @ApiOperation({
    summary: 'Get reactions counts on vacancies or resume',
  })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Get('/reactions/counts')
  getUsersReactionsCounts(
    @Req() req,
    @Query()
    query: {
      model: string;
    },
  ): Promise<UserReactionsCounts> {
    if (query?.model !== 'vacancy' && query?.model !== 'resume')
      throw new HttpException(
        `Wrong model provided ('vacancy' or 'resume' allowed only): ${query.model}`,
        HttpStatus.BAD_REQUEST,
      );

    const model = query.model === 'vacancy' ? 'vacancies' : 'resume';

    return this.userService.getUsersReactionsCounts(req.user.id, model);
  }

  @ApiOperation({ summary: 'Update status' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/status/update')
  updateStatus(@Body() status: UserStatus, @Req() req): Promise<User> {
    return this.userService.updateStatus(req.user.id, status);
  }
}
