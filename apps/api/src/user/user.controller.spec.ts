import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ICredential, IUser } from './interfaces';
import { CreateUserDto, UpdateUserDto } from './dtos';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    createUser: jest.fn(),
    updateUser: jest.fn(),
    getUser: jest.fn(),
    getUserRoom: jest.fn(),
  };

  const userCredential = {
    _id: 'credential-id',
    username: 'andi',
    email: 'andi@gmail.com',
    password: 'blablabla',
  } as ICredential;

  let user: IUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'andi',
      birthday: new Date().toLocaleDateString(),
      height: 180,
      weight: 65,
      interests: [],
    };

    const newUser = {
      _id: 'user-id-1',
      credential: userCredential,
      ...createUserDto,
    } as IUser;

    jest.spyOn(mockUserService, 'createUser').mockReturnValue(newUser);

    user = await controller.createUser(userCredential, createUserDto);

    expect(mockUserService.createUser).toBeCalled();
    expect(mockUserService.createUser).toBeCalledWith(
      userCredential,
      createUserDto,
    );

    expect(user).toEqual(newUser);
  });

  it('update user', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Andii',
    };

    const updatedUser = {
      ...user,
      ...updateUserDto,
    };

    jest.spyOn(mockUserService, 'updateUser').mockReturnValue(updatedUser);

    user = await controller.updateUser(userCredential, updateUserDto);

    expect(mockUserService.updateUser).toBeCalled();
    expect(mockUserService.updateUser).toBeCalledWith(
      userCredential,
      updateUserDto,
    );

    expect(user).toEqual(updatedUser);
  });

  it('get user', async () => {
    jest.spyOn(mockUserService, 'getUser').mockReturnValue(user);

    const findedUser = await controller.getProfile(userCredential, {
      targetUser: null,
    });

    expect(findedUser).toEqual(user);
  });

  it('get user room', async () => {
    const userRoomReturns = {
      userId: 'user-id-1',
      rooms: [
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
      ],
    };

    jest.spyOn(mockUserService, 'getUserRoom').mockReturnValue(userRoomReturns);

    const rooms = await controller.getUserRooms(userCredential);

    expect(mockUserService.getUserRoom).toBeCalled();
    expect(mockUserService.getUserRoom).toBeCalledWith(userCredential);

    expect(rooms).toEqual(userRoomReturns);
  });
});
