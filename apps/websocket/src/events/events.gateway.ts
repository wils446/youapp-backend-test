import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventService } from './events.service';

@WebSocketGateway(8123, { cors: { origin: '*' } })
export class EventsGateway implements OnGatewayConnection {
  @WebSocketServer()
  private readonly server: Server;

  constructor(private readonly eventService: EventService) {}

  handleConnection(client: Socket) {
    this.eventService.initUserRoom(client);
  }

  getServer() {
    return this.server;
  }
}
