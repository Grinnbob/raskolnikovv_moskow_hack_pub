import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { User } from 'src/users/users.model';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles-guard';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Signin' })
  @ApiResponse({ status: 200, type: User })
  @Post('/signin')
  login(
    @Body() userDto: CreateUserDto,
  ): Promise<{ token: string; user: User }> {
    return this.authService.login(userDto);
  }

  @ApiOperation({ summary: 'Signup' })
  @ApiResponse({ status: 200, type: User })
  @Post('/signup')
  signup(
    @Body() userDto: CreateUserDto,
  ): Promise<{ token: string; user: User }> {
    return this.authService.signup(userDto);
  }

  @ApiOperation({ summary: 'Recover password (email)' })
  @ApiResponse({ status: 200, type: User })
  @Post('/password/recovery/email')
  recoverPasswordByEmail(
    @Body() data: { email: string; role?: string },
  ): Promise<boolean> {
    return this.authService.recoverPasswordByEmail(data.email, data.role);
  }

  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch('/passwords/update')
  updatePassword(
    @Req() req,
    @Body() data: { oldPassword: string; newPassword: string },
  ) {
    return this.authService.updatePassword(
      req.user.id,
      data.oldPassword,
      data.newPassword,
    );
  }

  @ApiOperation({ summary: 'Update email' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Patch('/email/update')
  updateEmail(@Req() req, @Body() data: { email: string; password: string }) {
    return this.authService.updateEmail(req.user.id, data.email, data.password);
  }

  @ApiOperation({ summary: 'Send email verification code' })
  @ApiResponse({ status: 200, type: User })
  @UseGuards(RolesGuard, JwtAuthGuard)
  @Post('/send/emailValidationCode')
  sendEmailValidationCode(@Req() req) {
    return this.authService.sendEmailValidationCodeForUser(req.user.id);
  }
}
