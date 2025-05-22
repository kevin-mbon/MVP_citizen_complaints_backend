import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole, UserStatus } from '../../../common/enums/user-role';
import { UserPermission } from '../../../common/permissions/user-permission';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ type: String, enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Prop({ type: UserPermission, default: () => ({}) })
  permissions: UserPermission;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop({ type: String, default: null })
  createdBy: string;

  @Prop({ required: true, minlength: 6, select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);