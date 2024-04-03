import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MessageService } from './message.service';
import { GetUserCredential } from '@app/common/decorators';
import { ICredential } from '../user/interfaces';
import { SendMessageDto, ViewMessageDto } from './dtos';
import { JwtAuthGuard } from '@app/common/guards';

@Controller()
@UseGuards(JwtAuthGuard)
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post('/sendMessage')
  async sendMessage(
    @GetUserCredential() userCredential: ICredential,
    @Body() bodyPayload: SendMessageDto,
  ) {
    return await this.messageService.sendMessage(userCredential, bodyPayload);
  }

  @Get('/viewMessage')
  async viewMessage(
    @GetUserCredential() userCredential: ICredential,
    @Body() bodyPayload: ViewMessageDto,
  ) {
    return await this.messageService.getMessage(userCredential, bodyPayload);
  }
}
