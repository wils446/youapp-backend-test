import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CredentialRepository } from '../user/repositories';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { ICredential } from '../user/interfaces';

describe('AuthService', () => {
  let service: AuthService;

  const mockCredentialRepository = {
    create: jest.fn(),
    find: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: CredentialRepository,
          useValue: mockCredentialRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register', async () => {
    const registerDto = {
      email: 'andi@gmail.com',
      username: 'andi',
      password: 'blablabla',
    } as RegisterDto;

    const user = {
      _id: 'random-string',
      ...registerDto,
    } as ICredential;

    const returnToken = {
      token: 'token',
    };

    jest.spyOn(mockCredentialRepository, 'find').mockReturnValue([]);
    jest.spyOn(mockCredentialRepository, 'create').mockReturnValue(user);
    jest.spyOn(mockJwtService, 'signAsync').mockReturnValue('token');

    const result = await service.register(registerDto);

    expect(mockCredentialRepository.find).toBeCalled();
    expect(mockCredentialRepository.find).toBeCalledWith({
      $or: [
        { username: registerDto.username },
        { email: registerDto.username },
      ],
    });
    expect(mockCredentialRepository.find).toBeCalledWith({
      $or: [{ username: registerDto.email }, { email: registerDto.email }],
    });

    expect(mockCredentialRepository.create).toBeCalled();
    expect(mockCredentialRepository.create).toBeCalledWith(registerDto);

    expect(mockJwtService.signAsync).toBeCalled();
    expect(mockJwtService.signAsync).toBeCalledWith({ sub: user._id });

    expect(result).toEqual(returnToken);
  });

  it('login', async () => {
    const loginUserDto = {
      usernameOrEmail: 'andi',
      password: 'blablabla',
    } as LoginDto;

    const user = {
      _id: 'random-string',
      username: loginUserDto.usernameOrEmail,
      email: 'andi@gmail.com',
    } as ICredential;

    const returnToken = {
      token: 'random-string',
    };

    jest.spyOn(mockCredentialRepository, 'find').mockReturnValue([user]);
    jest.spyOn(mockJwtService, 'signAsync').mockReturnValue('random-string');
    jest.spyOn(bcrypt, 'compare').mockReturnValue(true);

    const result = await service.login(loginUserDto);

    expect(mockCredentialRepository.find).toBeCalled();
    expect(mockCredentialRepository.find).toBeCalledWith({
      $or: [
        { username: loginUserDto.usernameOrEmail },
        { email: loginUserDto.usernameOrEmail },
      ],
    });

    expect(mockJwtService.signAsync).toBeCalled();
    expect(mockJwtService.signAsync).toBeCalledWith({ sub: user._id });

    expect(result).toEqual(returnToken);
  });
});
