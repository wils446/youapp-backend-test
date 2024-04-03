import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly message: string;

  @IsString()
  @IsNotEmpty()
  readonly targetUser: string;
}
