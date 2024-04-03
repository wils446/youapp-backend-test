import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { IMessage } from '../interfaces';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Message } from '../schemas';
import { Connection, Document, Model, SaveOptions, Types } from 'mongoose';

@Injectable()
export class MessageRepository extends AbstractRepository<IMessage> {
  protected readonly logger = new Logger(MessageRepository.name);

  constructor(
    @InjectModel(Message.name) messageModel: Model<IMessage>,
    @InjectConnection() connection: Connection,
  ) {
    super(messageModel, connection);
  }

  async create(
    document: Pick<IMessage, 'user' | 'room' | 'message'>,
    options?: SaveOptions,
  ) {
    const newDocument = new this.model({ ...document });

    return await newDocument.save(options);
  }
}
