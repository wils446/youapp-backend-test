import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { EventService } from './events.service';
import { EventController } from './events.controller';
import { RmqModule } from '@app/common';

@Module({
  imports: [RmqModule],
  controllers: [EventController],
  providers: [EventService, EventsGateway],
})
export class EventsModule {}
