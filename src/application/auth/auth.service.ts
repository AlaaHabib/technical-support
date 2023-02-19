import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthDto, AuthResultDto } from 'src/domain/dtos/auth';
import { User } from 'src/domain/entities/user';
import { DataSource } from 'typeorm';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  async login(dto: AuthDto, refresh = false, userId?: number) {
    const user = await this.dataSource.manager.findOne(User, {
      where: refresh ? { id: userId } : { email: dto.email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        isActive: true,
        salt: true,
        userRole: { id: true, name: true },
      },
      relations: { userRole: true },
    });
    if (!user) {
      throw new ForbiddenException('Access Denied');
    }
    if (!user.isActive)
      throw new ForbiddenException('Access Denied, Your account is not active');
    if (!refresh) {
      const passwordMatches = await argon.verify(
        user.passwordHash,
        `${dto.password}.${user.salt}`,
      );
      if (!passwordMatches)
        throw new ForbiddenException('Credentials incorrect');
    }
    const payload = { email: user.email, sub: user.id, role: user.userRole.name };

    const tokens = await this.generateTokens(payload);
    return { token: tokens, role: user.userRole.name };
  }


  private async generateTokens(payload): Promise<AuthResultDto> {
    const [token, refreshToken] = await Promise.all([
      await this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow('ACCESS_TOKEN_KEY'),
        expiresIn: this.configService.getOrThrow('TOKEN_EXPIRE'),
      }),
      await this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow('REFRESH_TOKEN_KEY'),
        expiresIn: this.configService.getOrThrow('REFRESH_TOKEN_EXPIRE'),
      }),
    ]);
    return {
      access_token: token,
      refresh_token: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const decoded = this.jwtService.decode(refreshToken);
    return await this.login(null, true, decoded.sub);
  }
}
