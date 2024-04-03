import { Document } from 'mongoose';
import { ICredential } from './ICredential.interface';

export interface IUser extends Document {
  readonly name: string;
  readonly birthday: string;
  readonly height: number;
  readonly weight: number;
  readonly interests: string[];
  readonly credential: ICredential;
}
