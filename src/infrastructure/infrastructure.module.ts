import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../domain/entities';

import { TicketRepository, UserRepository } from './repositories';
const repos = [UserRepository , TicketRepository];

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  providers: [...repos],
  exports: [...repos],
})
export class InfrastructureModule {}
