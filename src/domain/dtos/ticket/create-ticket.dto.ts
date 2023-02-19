import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/domain/entities/user';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsBoolean()
  @ApiProperty()
  accept?: boolean;

  @IsBoolean()
  @ApiProperty()
  resolve?: boolean;


  @IsString()
  @ApiProperty()
  user?: User;
}
