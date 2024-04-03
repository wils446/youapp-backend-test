import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { WEBSOCKET_SERVICE } from 'apps/websocket/src/constants/service';
import { ClientSession } from 'mongoose';
import { lastValueFrom } from 'rxjs';
import { ICredential } from '../user/interfaces';
import { UserRepository } from '../user/repositories';
import { SendMessageDto, ViewMessageDto } from './dtos';
import { MessageRepository, RoomRepository } from './repositories';

@Injectable()
export class MessageService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly messageRepository: MessageRepository,
    private readonly userRepository: UserRepository,
    @Inject(WEBSOCKET_SERVICE)
    private readonly websocketClient: ClientProxy,
  ) {}

  async sendMessage(
    userCredential: ICredential,
    sendMessageDto: SendMessageDto,
  ) {
    if (userCredential.user._id.toString() === sendMessageDto.targetUser)
      throw new BadRequestException('target user cannot same with own id');

    const targetUser = await this.userRepository.findOne({
      _id: sendMessageDto.targetUser,
    });
    if (!targetUser) throw new NotFoundException('target user not found');

    const session = await this.userRepository.startTransaction();

    const room = await this.getMessageRoom(
      [userCredential.user._id.toString(), sendMessageDto.targetUser],
      session,
    );

    try {
      const newMessage = await this.messageRepository.create(
        {
          message: sendMessageDto.message,
          room: room._id,
          user: userCredential.user,
        },
        { session },
      );
      await session.commitTransaction();
      await lastValueFrom(
        this.websocketClient.emit('send-message', {
          message: newMessage,
        }),
      );
      return newMessage;
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async getMessage(
    userCredential: ICredential,
    viewMessageDto: ViewMessageDto,
  ) {
    if (userCredential.user._id.toString() === viewMessageDto.targetUser)
      throw new BadRequestException('target user cannot same with own id');

    const room = await this.getMessageRoom([
      userCredential.user._id.toString(),
      viewMessageDto.targetUser,
    ]);
    try {
      const messages = await this.messageRepository.find({ room: room });
      return { messages };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  private async getMessageRoom(usersId: string[], session?: ClientSession) {
    let room = await this.roomRepository.findOne({
      users: { $all: usersId },
    });
    if (!room) room = await this.createMessageRoom(usersId, session);

    return room;
  }

  private async createMessageRoom(usersId: string[], session?: ClientSession) {
    const users = await Promise.all([
      ...usersId.map(
        async (id) => await this.userRepository.findOne({ _id: id }),
      ),
    ]);

    try {
      const newRoom = await this.roomRepository.create({ users }, { session });
      await Promise.all([
        ...usersId.map(
          async (userId) =>
            await lastValueFrom(
              this.websocketClient.emit('join-new-room', {
                userId,
                roomId: newRoom._id,
              }),
            ),
        ),
      ]);
      return newRoom;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
