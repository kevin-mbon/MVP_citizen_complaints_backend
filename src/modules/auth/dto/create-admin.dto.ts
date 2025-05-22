import { IsEmail, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';
import { UserRole, UserStatus } from '../../../common/enums/user-role';
import { UserPermission } from '../../../common/permissions/user-permission';

export class CreateAdminDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  readonly name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please enter a valid email address' })
  readonly email: string;

  @IsEnum(UserRole, { message: 'Invalid role value' })
  @IsOptional()
  readonly role?: UserRole = UserRole.ADMIN;

  @IsEnum(UserStatus, { message: 'Invalid status value' })
  @IsOptional()
  readonly status?: UserStatus = UserStatus.ACTIVE;

  @IsObject({ message: 'Permissions must be an object' })
  @IsOptional()
  readonly permissions?: UserPermission;
}