import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  validate(payload: { sub: number; ecorreo: string; rol: string }) {
    if (!payload?.sub) {
      throw new UnauthorizedException('Token inválido');
    }

    return {
      id: payload.sub,
      ecorreo: payload.ecorreo,
      rol: payload.rol,
    };
  }
}
