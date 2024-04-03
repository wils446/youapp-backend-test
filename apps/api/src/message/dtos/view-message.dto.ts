import { IsNotEmpty, IsString } from 'class-validator';

export class ViewMessageDto {
  @IsString()
  @IsNotEmpty()
  readonly targetUser: string;
}
