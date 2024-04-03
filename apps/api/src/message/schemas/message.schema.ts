import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Message {
  @Prop({ required: true })
  message: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Room', required: true })
  room: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
