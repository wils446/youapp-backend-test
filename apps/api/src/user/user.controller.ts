import { GetUserCredential } from '@app/common/decorators';
import { JwtAuthGuard } from '@app/common/guards';
import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dtos';
import { ICredential } from './interfaces';
import { UserService } from './user.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/createProfile')
  async createUser(
    @GetUserCredential() userCredential: ICredential,
    @Body() bodyPayload: CreateUserDto,
  ) {
    return await this.userService.createUser(userCredential, bodyPayload);
  }

  @Patch('/updateProfile')
  async updateUser(
    @GetUserCredential() userCredential: ICredential,
    @Body() bodyPayload: UpdateUserDto,
  ) {
    return await this.userService.updateUser(userCredential, bodyPayload);
  }

  @Get('/getProfile')
  async getProfile(@GetUserCredential() userCredential: ICredential) {
    return await this.userService.getUser(userCredential);
  }

  @Get('/user/rooms')
  async getUserRooms(@GetUserCredential() userCredential: ICredential) {
    return await this.userService.getUserRoom(userCredential);
  }
}
