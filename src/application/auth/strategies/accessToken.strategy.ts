import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomLogger } from 'src/domain/helpers';


type JwtPayload = {
  sub: string;
  email: string;
  role: string;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
 
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_KEY,
    });
  }
  async validate(payload: any) {
    CustomLogger({payload})
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}
