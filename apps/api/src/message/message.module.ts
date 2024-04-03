import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Models } from './schemas';
import { MessageRepository, RoomRepository } from './repositories';
import { UserModule } from '../user/user.module';
import { RmqModule } from '@app/common';
import { WEBSOCKET_SERVICE } from 'apps/websocket/src/constants/service';

@Module({
  imports: [
    MongooseModule.forFeature(Models),
    forwardRef(() => UserModule),
    RmqModule.register({
      name: WEBSOCKET_SERVICE,
    }),
  ],
  controllers: [MessageController],
  providers: [MessageService, RoomRepository, MessageRepository],
  exports: [RoomRepository],
})
export class MessageModule {}
