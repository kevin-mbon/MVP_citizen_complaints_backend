import { Prop } from '@nestjs/mongoose';

export class UserPermission {
  @Prop({ default: false })
  canViewUsers: boolean;

  @Prop({ default: false })
  canManageUsers: boolean;

  @Prop({ default: false })
  canViewCategories: boolean;

  @Prop({ default: false })
  canManageCategories: boolean;

  @Prop({ default: false })
  canAddAdmins: boolean;

  @Prop({ default: false })
  canManagePermissions: boolean;
}
