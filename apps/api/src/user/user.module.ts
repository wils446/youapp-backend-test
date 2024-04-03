import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CredentialRepository, UserRepository } from './repositories';
import { MongooseModule } from '@nestjs/mongoose';
import { Models } from './schemas';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [MongooseModule.forFeature(Models), MessageModule],
  providers: [UserService, UserRepository, CredentialRepository],
  controllers: [UserController],
  exports: [UserRepository, CredentialRepository],
})
export class UserModule {}
