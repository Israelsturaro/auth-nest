// src/users/dto/update-user.dto.ts
import { IsOptional, IsEmail, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../enum/role';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'novoUsername' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional({ example: 'foo@bar.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+5511999999999' })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({ enum: UserRole })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
