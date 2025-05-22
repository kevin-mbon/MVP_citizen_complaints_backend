
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: 0 })
  complaintOrFeedbackCount: number;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
