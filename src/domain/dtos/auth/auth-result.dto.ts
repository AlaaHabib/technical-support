import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthResultDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  access_token: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  refresh_token: string;
}
