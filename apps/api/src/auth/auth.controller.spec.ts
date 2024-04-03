import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos';
import { LoginDto, RegisterDto } from './dtos';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register an user', async () => {
    const createUserDto = {
      username: 'andi',
      email: 'andi@mgail.com',
      password: 'blablabla',
    } as RegisterDto;

    const returnToken = {
      token: 'token',
    };

    jest.spyOn(mockAuthService, 'register').mockReturnValue(returnToken);

    const result = await controller.register(createUserDto);

    expect(mockAuthService.register).toBeCalled();
    expect(mockAuthService.register).toBeCalledWith(createUserDto);

    expect(result).toEqual(returnToken);
  });

  it('login an user', async () => {
    const loginUserDto = {
      usernameOrEmail: 'andi',
      password: 'blablabla',
    } as LoginDto;

    const returnToken = {
      token: 'token',
    };

    jest.spyOn(mockAuthService, 'login').mockReturnValue(returnToken);

    const result = await controller.login(loginUserDto);

    expect(mockAuthService.login).toBeCalled();
    expect(mockAuthService.login).toBeCalledWith(loginUserDto);

    expect(result).toEqual(returnToken);
  });
});
