import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MaxLength(16)
  @IsNotEmpty()
  readonly username: string;

  @IsString()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
