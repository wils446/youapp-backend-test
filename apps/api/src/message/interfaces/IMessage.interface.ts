import { Document } from 'mongoose';
import { IUser } from '../../user/interfaces';
import { IRoom } from './IRoom.interface';

export interface IMessage extends Document {
  readonly message: string;
  readonly room: IRoom;
  readonly user: IUser;
}
