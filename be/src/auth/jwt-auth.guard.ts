import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { PinoLoggerService } from 'src/logger/logger.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly logger: PinoLoggerService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization ?? req.headers.Authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({ message: 'User unauthorized' });
      }

      const user = this.jwtService.verify(token);
      req.user = user;

      this.logger.assign({ userId: user.id });
      this.logger.assign({ role: user.role });

      if (user.isBanned) {
        throw new UnauthorizedException({ message: 'User has been banned' });
      }

      return true;
    } catch (e) {
      this.logger.error(e);
      throw new HttpException(
        `Can't validate user: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
