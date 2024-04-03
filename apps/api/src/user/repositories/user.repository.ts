import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, SaveOptions } from 'mongoose';
import { CreateUserDto } from '../dtos';
import { ICredential, IUser } from '../interfaces';
import { User } from '../schemas';

@Injectable()
export class UserRepository extends AbstractRepository<IUser> {
  protected readonly logger = new Logger(UserRepository.name);

  constructor(
    @InjectModel(User.name)
    userModel: Model<IUser>,
    @InjectConnection()
    connection: Connection,
  ) {
    super(userModel, connection);
  }

  async create(
    document: CreateUserDto & { credential: ICredential },
    options?: SaveOptions,
  ) {
    const newDocument = new this.model({ ...document });

    return await newDocument.save();
  }
}
