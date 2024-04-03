import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(16)
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly birthday: string;

  @IsNumber()
  @IsNotEmpty()
  readonly weight: number;

  @IsNumber()
  @IsNotEmpty()
  readonly height: number;

  @IsArray()
  @IsString({ each: true })
  readonly interests: string[];
}
