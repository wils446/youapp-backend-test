import { Controller } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { EventService } from './events.service';
import { EventsGateway } from './events.gateway';
import { RmqService } from '@app/common';

@Controller()
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly eventGateway: EventsGateway,
    private readonly rmqService: RmqService,
  ) {}

  @EventPattern('send-message')
  async handleSendMessage(@Payload() data: any, @Ctx() context: RmqContext) {
    await this.eventService.notifyUser(
      this.eventGateway.getServer(),
      data.message,
    );
    this.rmqService.ack(context);
  }

  @EventPattern('join-new-room')
  async handleJoinNewRoom(
    @Payload() data: { userId: string; roomId: string },
    @Ctx() context: RmqContext,
  ) {
    await this.eventService.userJoinRoom(data);
    this.rmqService.ack(context);
  }
}
