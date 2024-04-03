import { Document } from 'mongoose';
import { IUser } from './IUser.interface';

export interface ICredential extends Document {
  readonly username: string;
  readonly email: string;
  readonly password: string;
  readonly user: IUser;
}
