import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { CredentialRepository } from '../../user/repositories';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly credentialRepository: CredentialRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: { sub: string }) {
    const credentialUser = await this.credentialRepository.findOne({
      _id: payload.sub,
    });

    if (!credentialUser) throw new UnauthorizedException();

    return credentialUser;
  }
}
