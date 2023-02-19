import { ApiProperty } from '@nestjs/swagger';
import {  IsNotEmpty, IsNumber } from 'class-validator';

export class AssignTicketDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;
}
