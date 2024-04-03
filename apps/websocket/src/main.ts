import { NestFactory } from '@nestjs/core';
import { WebsocketModule } from './websocket.module';
import { RmqService } from '@app/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(WebsocketModule);
  app.useWebSocketAdapter(new IoAdapter(app));
  const rmqService = app.get<RmqService>(RmqService, { strict: false });
  app.connectMicroservice(rmqService.getOptions('WEBSOCKET'));
  await app.startAllMicroservices();
  app.listen(3001);
}
bootstrap();
