import { AbstractRepository } from '@app/common/database/abstract.repository';
import { Injectable, Logger } from '@nestjs/common';
import { Credential } from '../schemas';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, SaveOptions } from 'mongoose';
import { RegisterDto } from '../../auth/dtos';
import { ICredential } from '../interfaces';

@Injectable()
export class CredentialRepository extends AbstractRepository<ICredential> {
  protected readonly logger = new Logger(CredentialRepository.name);

  constructor(
    @InjectModel(Credential.name)
    credentialModel: Model<ICredential>,
    @InjectConnection()
    connection: Connection,
  ) {
    super(credentialModel, connection);
  }

  async create(document: RegisterDto, options?: SaveOptions) {
    const newDocument = new this.model({ ...document });

    return await newDocument.save(options);
  }
}
