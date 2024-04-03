import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ICredential, IUser } from '../user/interfaces';
import { IMessage, IRoom } from './interfaces';
import { SendMessageDto, ViewMessageDto } from './dtos';

describe('MessageController', () => {
  let controller: MessageController;

  const user = {
    _id: 'user-id-1',
    name: 'andi',
    birthday: new Date().toLocaleDateString(),
    height: 180,
    weight: 65,
    interests: [],
  } as IUser;

  const userCredential = {
    _id: 'credential-id',
    username: 'andi',
    email: 'andi@gmail.com',
    password: 'blablabla',
    user,
  } as ICredential;

  const rooms = [
    {
      _id: 'room-id-1',
      users: ['user-id-1', 'user-id-2'],
    },
    {
      _id: 'room-id-2',
      users: ['user-id-1', 'user-id-3'],
    },
  ];

  const message = [] as IMessage[];

  const mockMessageService = {
    sendMessage: jest.fn(),
    getMessage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('send message', async () => {
    const sendMessageDto = {
      message: 'test',
      targetUser: 'user-id-2',
    } as SendMessageDto;

    const newMessage = {
      _id: 'message-id-1',
      message: sendMessageDto.message,
      user: userCredential.user,
      room: rooms.find(
        (room) =>
          room.users.includes(userCredential.user._id) &&
          room.users.includes(sendMessageDto.targetUser),
      ) || { _id: 'random' },
    } as IMessage;

    jest.spyOn(mockMessageService, 'sendMessage').mockResolvedValue(newMessage);

    const result = await controller.sendMessage(userCredential, sendMessageDto);
    message.push(newMessage);

    expect(mockMessageService.sendMessage).toBeCalled();
    expect(mockMessageService.sendMessage).toBeCalledWith(
      userCredential,
      sendMessageDto,
    );

    expect(result).toEqual(newMessage);
  });

  it('view message', async () => {
    const viewMessageDto = {
      targetUser: 'user-id-2',
    } as ViewMessageDto;

    const roomId = rooms.find(
      (room) =>
        room.users.includes(userCredential.user._id) &&
        room.users.includes(viewMessageDto.targetUser),
    )._id;

    const viewMessageReturn = {
      messages: message.filter((message) => message.room._id === roomId),
    } as { messages: IMessage[] };

    jest
      .spyOn(mockMessageService, 'getMessage')
      .mockResolvedValue(viewMessageReturn);

    const result = await controller.viewMessage(userCredential, viewMessageDto);

    expect(mockMessageService.getMessage).toBeCalled();
    expect(mockMessageService.getMessage).toBeCalledWith(
      userCredential,
      viewMessageDto,
    );

    expect(result).toEqual(viewMessageReturn);
  });
});
