import { ModelDefinition } from '@nestjs/mongoose';
import { RoomSchema } from './room.schema';
import { MessageSchema } from './message.schema';

export * from './message.schema';
export * from './room.schema';

export const Models: ModelDefinition[] = [
  {
    name: 'Room',
    schema: RoomSchema,
  },
  {
    name: 'Message',
    schema: MessageSchema,
  },
];
