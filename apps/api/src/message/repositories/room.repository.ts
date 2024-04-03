import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Document, Model, SaveOptions, Types } from 'mongoose';
import { IRoom } from '../interfaces';
import { Room } from '../schemas';

@Injectable()
export class RoomRepository extends AbstractRepository<IRoom> {
  protected readonly logger = new Logger(RoomRepository.name);

  constructor(
    @InjectModel(Room.name) roomModel: Model<IRoom>,
    @InjectConnection() connection: Connection,
  ) {
    super(roomModel, connection);
  }

  async create(document: Pick<IRoom, 'users'>, options?: SaveOptions) {
    const newDocument = new this.model({ ...document });

    return await newDocument.save(options);
  }
}
