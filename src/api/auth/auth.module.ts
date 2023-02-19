import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from 'src/application/auth/auth.service';

import { AuthController } from './auth.controller';
import { AccessTokenStrategy, RefreshTokenStrategy } from 'src/application/auth/strategies';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({}),
  ],
  controllers:[AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
  exports: [AuthService],
})
export class AuthModule {}