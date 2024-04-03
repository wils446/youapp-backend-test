import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() bodyPayload: RegisterDto) {
    return await this.authService.register(bodyPayload);
  }

  @Post('/login')
  async login(@Body() bodyPayload: LoginDto) {
    return await this.authService.login(bodyPayload);
  }
}
