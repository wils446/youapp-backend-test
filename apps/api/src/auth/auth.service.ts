import { Injectable } from '@nestjs/common';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CredentialRepository } from '../user/repositories';
import { LoginDto, RegisterDto } from './dtos';

@Injectable()
export class AuthService {
  constructor(
    private readonly credentialRepository: CredentialRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const credentialByUsername = await this.findUserByUsernameOrEmail(
      registerDto.username,
    );
    const credentialByEmail = await this.findUserByUsernameOrEmail(
      registerDto.email,
    );

    if (credentialByEmail.length)
      throw new ConflictException('username already used');
    if (credentialByUsername.length)
      throw new ConflictException('email already registered');

    try {
      const newCredential = await this.credentialRepository.create(registerDto);
      const token = await this.jwtService.signAsync({ sub: newCredential._id });
      return { token };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  async login(loginDto: LoginDto) {
    const userCredential = await this.findUserByUsernameOrEmail(
      loginDto.usernameOrEmail,
    );
    if (!userCredential.length)
      throw new NotFoundException("username or email doesn't exists");

    const isPasswordMatch = await this.comparePassword(
      loginDto.password,
      userCredential[0].password,
    );
    if (!isPasswordMatch) throw new UnauthorizedException('password is wrong');

    try {
      const token = await this.jwtService.signAsync({
        sub: userCredential[0]._id,
      });
      return { token };
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }

  private async findUserByUsernameOrEmail(query: string) {
    const userCredential = await this.credentialRepository.find({
      $or: [{ username: query }, { email: query }],
    });

    return userCredential;
  }

  private async comparePassword(rawPassword: string, hashPassword: string) {
    try {
      return await bcrypt.compare(rawPassword, hashPassword);
    } catch (err) {
      throw new InternalServerErrorException((err as Error).message);
    }
  }
}
