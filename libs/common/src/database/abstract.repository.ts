import { Logger, NotFoundException } from '@nestjs/common';
import {
  ClientSession,
  Connection,
  Document,
  FilterQuery,
  Model,
  QueryOptions,
  SaveOptions,
} from 'mongoose';

export abstract class AbstractRepository<TDocument extends Document> {
  protected abstract readonly logger: Logger;

  constructor(
    protected readonly model: Model<TDocument>,
    private readonly connection: Connection,
  ) {}

  async create(document: Omit<TDocument, '_id'>, options?: SaveOptions) {
    const newDocument = new this.model({ ...document });

    return await newDocument.save(options);
  }

  async findOne(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    return document;
  }

  async findOneAndThrow(filterQuery: FilterQuery<TDocument>) {
    const document = await this.model.findOne(filterQuery, {}, { lean: true });

    if (!document) {
      this.logger.warn('Document not found with filterQuery', filterQuery);
      throw new NotFoundException('Document not found.');
    }

    return document;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    document: Partial<TDocument>,
    options?: QueryOptions<TDocument>,
  ) {
    return this.model.findOneAndUpdate(filterQuery, document, {
      lean: true,
      upsert: true,
      new: true,
      ...options,
    });
  }

  async find(filterQuery: FilterQuery<TDocument>) {
    return await this.model.find(filterQuery, {}, { lean: true });
  }

  async startTransaction(): Promise<ClientSession> {
    const session = await this.connection.startSession();
    session.startTransaction();
    return session;
  }
}
