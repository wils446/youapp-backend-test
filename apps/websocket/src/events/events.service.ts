import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Server, Socket } from 'socket.io';
import { Message, Room } from '../interfaces';

@Injectable()
export class EventService {
  private apiUrl: string;
  private socket: Socket;
  private connectedClient: Map<string, Socket> = new Map();

  constructor(configService: ConfigService) {
    this.apiUrl = configService.get<string>('API_URI');
  }

  async initUserRoom(socket: Socket) {
    this.socket = socket;
    const response = await fetch(`${this.apiUrl}/api/user/rooms`, {
      headers: {
        authorization: socket.handshake.headers.authorization,
      },
    });

    if (response.status === 401) return this.unauthorizedError();

    const userData: { userId: string; rooms: Room[] } = await response.json();

    this.connectedClient.set(userData.userId, socket);
    socket.join(userData.rooms.map((room) => room._id));

    socket.on('disconnect', () => {
      this.connectedClient.delete(userData.userId);
    });
  }

  async notifyUser(server: Server, data: Message) {
    server.to(data.room).emit('receive-message', { newMessage: data });
  }

  async userJoinRoom(data: { userId: string; roomId: string }) {
    if (!this.connectedClient.has(data.userId)) return;
    const userSocket = this.connectedClient.get(data.userId);
    userSocket.join(data.roomId);
  }

  async unauthorizedError() {
    this.socket.emit('unauthorized-error');
    this.socket.disconnect();
  }
}
