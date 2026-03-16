import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Thread extends Document {
  @Prop({ required: true })
  title!: string;

  @Prop({ required: true })
  categoryId!: string;

  @Prop({ required: true })
  authorId!: string;

  createdAt!: Date;
  updatedAt!: Date;
}

export const ThreadSchema = SchemaFactory.createForClass(Thread);
