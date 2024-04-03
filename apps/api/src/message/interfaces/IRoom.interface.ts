import { Document } from 'mongoose';
import { IUser } from '../../user/interfaces';

export interface IRoom extends Document {
  users: IUser[];
}
