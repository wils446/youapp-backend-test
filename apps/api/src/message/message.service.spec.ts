import { Test, TestingModule } from '@nestjs/testing';
import { WEBSOCKET_SERVICE } from 'apps/websocket/src/constants/service';
import { UserRepository } from '../user/repositories';
import { MessageService } from './message.service';
import { MessageRepository, RoomRepository } from './repositories';
import { IMessage } from './interfaces';
import { ICredential, IUser } from '../user/interfaces';
import { SendMessageDto, ViewMessageDto } from './dtos';
import * as rxjs from 'rxjs';

describe('MessageService', () => {
  let service: MessageService;

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

  const mockRoomRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
  };
  const mockMessageRepository = {
    create: jest.fn(),
    find: jest.fn(),
  };
  const mockUserRepository = {
    findOne: jest.fn(),
    startTransaction: jest.fn(),
  };
  const mockWebsocketClient = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: RoomRepository,
          useValue: mockRoomRepository,
        },
        {
          provide: MessageRepository,
          useValue: mockMessageRepository,
        },
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: WEBSOCKET_SERVICE,
          useValue: mockWebsocketClient,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('send message', async () => {
    const sendMessageDto = {
      message: 'test',
      targetUser: 'user-id-2',
    } as SendMessageDto;

    const room = rooms.find(
      (room) =>
        room.users.includes(userCredential.user._id) &&
        room.users.includes(sendMessageDto.targetUser),
    ) || { _id: 'random' };

    const newMessage = {
      _id: 'message-id-1',
      message: sendMessageDto.message,
      user: userCredential.user,
      room,
    } as IMessage;

    const mockSession = {
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
    };

    jest
      .spyOn(mockUserRepository, 'findOne')
      .mockResolvedValue({ _id: sendMessageDto.targetUser });
    jest
      .spyOn(mockUserRepository, 'startTransaction')
      .mockResolvedValue(mockSession);
    jest.spyOn(mockRoomRepository, 'findOne').mockResolvedValue(room);
    jest.spyOn(mockMessageRepository, 'create').mockResolvedValue(newMessage);
    jest.spyOn(rxjs, 'lastValueFrom').mockImplementation();
    jest.spyOn(mockWebsocketClient, 'emit').mockImplementation();

    const result = await service.sendMessage(userCredential, sendMessageDto);

    expect(mockUserRepository.findOne).toBeCalled();
    expect(mockUserRepository.findOne).toBeCalledWith({
      _id: sendMessageDto.targetUser,
    });

    expect(mockRoomRepository.findOne).toBeCalled();
    expect(mockRoomRepository.findOne).toBeCalledWith({
      users: { $all: [user._id, sendMessageDto.targetUser] },
    });

    expect(mockMessageRepository.create).toBeCalled();
    expect(mockMessageRepository.create).toBeCalledWith(
      {
        message: sendMessageDto.message,
        room: room._id,
        user: user,
      },
      { session: mockSession },
    );

    expect(rxjs.lastValueFrom).toBeCalled();
    expect(mockWebsocketClient.emit).toBeCalled();

    expect(result).toEqual(newMessage);
  });

  it('get message', async () => {
    const viewMessageDto = {
      targetUser: 'user-id-2',
    } as ViewMessageDto;

    const room = rooms.find(
      (room) =>
        room.users.includes(userCredential.user._id) &&
        room.users.includes(viewMessageDto.targetUser),
    ) || { _id: 'random' };

    const messages = message.filter((message) => message.room._id === room._id);

    jest.spyOn(mockRoomRepository, 'findOne').mockResolvedValue(room);
    jest.spyOn(mockMessageRepository, 'find').mockResolvedValue(messages);

    const result = await service.getMessage(userCredential, viewMessageDto);

    expect(mockRoomRepository.findOne).toBeCalled();
    expect(mockRoomRepository.findOne).toBeCalledWith({
      users: { $all: [user._id, viewMessageDto.targetUser] },
    });

    expect(mockMessageRepository.find).toBeCalled();
    expect(mockMessageRepository.find).toBeCalledWith({ room });

    expect(result).toEqual({ messages });
  });
});
