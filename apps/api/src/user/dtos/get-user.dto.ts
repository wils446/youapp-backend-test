import { IsOptional, IsString } from 'class-validator';

export class GetUserDto {
  @IsString()
  @IsOptional()
  targetUser: string;
}
