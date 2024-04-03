import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { SchemaTypes, Types } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Credential {
  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', default: null })
  user: Types.ObjectId;
}

export const CredentialSchema = SchemaFactory.createForClass(Credential);

CredentialSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;

  if (!user.isModified('password')) {
    console.log('abc');
    return next();
  }

  try {
    const salt = await bcrypt.genSaltSync();
    const hash = await bcrypt.hashSync(user.password, salt);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err);
  }
});
