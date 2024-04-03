import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { CredentialRepository, UserRepository } from './repositories';
import { RoomRepository } from '../message/repositories';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { ICredential, IUser } from './interfaces';

describe('UserService', () => {
  let service: UserService;

  const userCredential = {
    _id: 'credential-id',
    username: 'andi',
    email: 'andi@gmail.com',
    password: 'blablabla',
  } as ICredential;

  let user: IUser;

  const mockUserRepository = {
    startTransaction: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOne: jest.fn(),
  };
  const mockCredentialRepository = {
    findOneAndUpdate: jest.fn(),
  };
  const mockRoomRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
        {
          provide: CredentialRepository,
          useValue: mockCredentialRepository,
        },
        {
          provide: RoomRepository,
          useValue: mockRoomRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create user', async () => {
    const createUserDto = {
      name: 'Andi',
      birthday: new Date().toLocaleDateString(),
      weight: 75,
      height: 180,
      interests: ['eat'],
    } as CreateUserDto;

    const newUser = {
      _id: 'user-id',
      ...createUserDto,
      credential: userCredential,
    } as IUser;

    const mockSession = {
      commitTransaction: jest.fn(),
      abortTransaction: jest.fn(),
    };

    jest
      .spyOn(mockUserRepository, 'startTransaction')
      .mockResolvedValue(mockSession);
    jest.spyOn(mockUserRepository, 'create').mockResolvedValue(newUser);
    jest
      .spyOn(mockCredentialRepository, 'findOneAndUpdate')
      .mockImplementation();

    user = await service.createUser(userCredential, createUserDto);

    expect(mockUserRepository.create).toBeCalled();
    expect(mockUserRepository.create).toBeCalledWith(
      {
        ...createUserDto,
        credential: userCredential,
      },
      { session: mockSession },
    );

    expect(user).toEqual(newUser);
  });

  it('update user', async () => {
    const updateUserDto = {
      name: 'Andiii',
    } as UpdateUserDto;

    const updatedUser = {
      ...user,
      ...updateUserDto,
    };

    jest
      .spyOn(mockUserRepository, 'findOneAndUpdate')
      .mockResolvedValue(updatedUser);

    user = await service.updateUser(
      { ...userCredential, user: user } as ICredential,
      updateUserDto,
    );

    expect(mockUserRepository.findOneAndUpdate).toBeCalled();
    expect(mockUserRepository.findOneAndUpdate).toBeCalledWith(
      {
        _id: user._id,
      },
      updateUserDto,
      { session: undefined },
    );

    expect(user).toEqual(updatedUser);
  });

  it('get user', async () => {
    jest.spyOn(mockUserRepository, 'findOne').mockResolvedValue(user);

    const result = await service.getUser(
      { ...userCredential, user: user } as ICredential,
      { targetUser: undefined },
    );

    expect(mockUserRepository.findOne).toBeCalled();
    expect(mockUserRepository.findOne).toBeCalledWith({ _id: user._id });

    expect(result).toEqual(user);
  });

  it('get user room', async () => {
    const findRoomReturn = [
      {
        _id: 'room-id-1',
        users: ['user-id-1', 'user-id-2'],
        createdAt: '2024-04-03T10:53:29.263Z',
        updatedAt: '2024-04-03T10:53:29.263Z',
      },
      {
        _id: 'room-id-2',
        users: ['user-id-1', 'user-id-3'],
        createdAt: '2024-04-03T10:55:36.263Z',
        updatedAt: '2024-04-03T10:55:36.263Z',
      },
    ];

    const returnValue = {
      rooms: findRoomReturn,
      userId: user._id,
    };

    jest.spyOn(mockRoomRepository, 'find').mockResolvedValue(findRoomReturn);

    const rooms = await service.getUserRoom({
      ...userCredential,
      user: user,
    } as ICredential);

    expect(mockRoomRepository.find).toBeCalled();
    expect(mockRoomRepository.find).toBeCalledWith({
      users: {
        $in: [user._id],
      },
    });

    expect(rooms).toEqual(returnValue);
  });
});
