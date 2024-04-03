import { ModelDefinition } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { CredentialSchema } from './credential.schema';

export * from './credential.schema';
export * from './user.schema';

export const Models: ModelDefinition[] = [
  { name: 'User', schema: UserSchema },
  {
    name: 'Credential',
    schema: CredentialSchema,
  },
];
