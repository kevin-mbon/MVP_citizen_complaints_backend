import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserPermissionsDto {
  @IsBoolean()
  @IsOptional()
  readonly canViewUsers?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly canManageUsers?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly canViewCategories?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly canManageCategories?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly canAddAdmins?: boolean;

  @IsBoolean()
  @IsOptional()
  readonly canManagePermissions?: boolean;
}