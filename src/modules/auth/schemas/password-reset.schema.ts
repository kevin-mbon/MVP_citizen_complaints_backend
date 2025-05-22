import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type PasswordResetDocument = PasswordReset & Document;

@Schema({ timestamps: true })
export class PasswordReset {
  @Prop({ required: true, ref: 'User' })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  code: string;

  @Prop({ required: true, default: Date.now, expires: 3600 }) // Expires in 1 hour
  createdAt: Date;

  @Prop({ default: false })
  used: boolean;
}

export const PasswordResetSchema = SchemaFactory.createForClass(PasswordReset);

PasswordResetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
