import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as fs from 'fs';
import * as path from 'path';
import { JwtPayload } from './JwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // eslint-disable-next-line prettier/prettier
      secretOrKey: fs.readFileSync(path.join(process.cwd(), 'keys', 'public.pem')),
    });
  }

  validate(payload: JwtPayload) {
    return {
      userId: payload.id,
      email: payload.email,
      username: payload.username,
      role: payload.role,
    };
  }
}
