import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Room {
  @Prop([{ type: SchemaTypes.ObjectId, ref: 'User' }])
  users: Types.ObjectId[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.virtual('Message', {
  ref: 'Message',
  localField: '_id',
  foreignField: 'room',
});
