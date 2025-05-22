import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InstitutionDocument = Institution & Document;

@Schema({ timestamps: true })
export class Institution {
  @Prop({ required: true }) name: string;
  @Prop({ required: true }) address: string;
}

export const InstitutionSchema = SchemaFactory.createForClass(Institution);