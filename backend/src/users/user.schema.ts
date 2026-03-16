import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: { createdAt: true, updatedAt: false } })
export class User extends Document {
  @Prop({ required: true, unique: true, index: true })
  firebaseUid!: string;

  @Prop()
  displayName?: string;

  @Prop()
  email?: string;

  @Prop()
  photoURL?: string;

  createdAt!: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
