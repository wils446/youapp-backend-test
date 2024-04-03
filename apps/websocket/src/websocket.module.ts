import { Module } from '@nestjs/common';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { RmqModule } from '@app/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        API_URI: Joi.string().required(),
        RABBIT_MQ_URI: Joi.string().required(),
        RABBIT_MQ_WEBSOCKET_QUEUE: Joi.string().required(),
      }),
      envFilePath: './apps/websocket/.env',
    }),
    RmqModule,
    EventsModule,
  ],
  controllers: [],
  providers: [],
})
export class WebsocketModule {}
