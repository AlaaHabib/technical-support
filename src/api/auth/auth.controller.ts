import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {  ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/application/auth/auth.service';
import { AuthDto } from 'src/domain/dtos/auth';

const routBase = 'auth';

@ApiTags(routBase)
@Controller(routBase)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

}
