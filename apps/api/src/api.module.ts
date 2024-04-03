import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { DatabaseModule } from '@app/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { AuthModule } from './auth/auth.module';
import { MessageModule } from './message/message.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRES: Joi.string().required(),
      }),
      envFilePath: './apps/api/.env',
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    MessageModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
