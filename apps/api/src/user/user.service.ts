import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, GetUserDto, UpdateUserDto } from './dtos';
import { ICredential, IUser } from './interfaces';
import { CredentialRepository, UserRepository } from './repositories';
import { ClientSession } from 'mongoose';
import { RoomRepository } from '../message/repositories';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly credentialRepository: CredentialRepository,
    private readonly roomRepository: RoomRepository,
  ) {}

  async createUser(userCredential: ICredential, createUserDto: CreateUserDto) {
    if (userCredential.user)
      throw new ConflictException('user already created');

    const session = await this.userRepository.startTransaction();

    try {
      const newUser = await this.userRepository.create(
        {
          ...createUserDto,
          credential: userCredential,
        },
        { session },
      );
      await this.updateUserCredential(newUser);
      await session.commitTransaction();
      return newUser;
    } catch (err) {
      await session.abortTransaction();
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async updateUser(
    userCredential: ICredential,
    updateUserDto: UpdateUserDto,
    session?: ClientSession,
  ) {
    if (!userCredential.user)
      throw new NotFoundException('profile not created');

    try {
      const user = await this.userRepository.findOneAndUpdate(
        {
          _id: userCredential.user._id,
        },
        updateUserDto,
        { session },
      );
      return user;
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async getUser(userCredential: ICredential, getUserDto: GetUserDto) {
    let targetId = userCredential.user._id;
    if (getUserDto.targetUser) targetId = getUserDto.targetUser;

    return await this.userRepository.findOne({ _id: targetId });
  }

  async getUserRoom(userCredential: ICredential) {
    console.log(userCredential);
    const rooms = await this.roomRepository.find({
      users: { $in: [userCredential.user._id] },
    });

    return {
      userId: userCredential.user,
      rooms,
    };
  }

  private async updateUserCredential(user: IUser, session?: ClientSession) {
    await this.credentialRepository.findOneAndUpdate(
      user.credential._id,
      {
        user: user._id,
      },
      { session },
    );
  }
}
