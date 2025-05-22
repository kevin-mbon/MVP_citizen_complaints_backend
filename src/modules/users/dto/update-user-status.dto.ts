import { IsEnum, IsNotEmpty } from 'class-validator';
import { UserStatus } from '../../../common/enums/user-role';

export class UpdateUserStatusDto {
  @IsNotEmpty({ message: 'Status is required' })
  @IsEnum(UserStatus, { message: 'Invalid status value' })
  readonly status: UserStatus;
}