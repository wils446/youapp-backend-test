import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  birthday: string;

  @Prop({ required: true })
  height: number;

  @Prop({ required: true })
  weight: number;

  @Prop({ required: true })
  interests: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Credential', required: true })
  credential: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
