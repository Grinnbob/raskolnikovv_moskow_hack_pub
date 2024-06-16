import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';
import { UserGender, UserStatus } from '../users.model';

export class AddInfoToUserDto {
  @ApiProperty({ example: 'Grig', description: 'User name' })
  @IsString({ message: 'Must be string' })
  readonly firstName: string;

  @ApiProperty({ example: 'Pol', description: 'User sername' })
  @IsString({ message: 'Must be string' })
  readonly lastName: string;

  
  
  
  

  @ApiProperty({ example: 'Moscow', description: 'User location' })
  @IsString({ message: 'Must be string' })
  @IsOptional()
  readonly location: string;

  @ApiProperty({ example: UserGender.MALE, description: 'User gender' })
  readonly gender: UserGender;

  @ApiProperty({ example: new Date(), description: 'User birthDate' })
  @IsDateString()
  readonly birthDate: Date;

  @ApiProperty({
    example: UserStatus.ACTIVELY_CONSIDERING_OFFERS,
    description: 'User status',
  })
  @IsOptional()
  readonly status?: UserStatus;
}
