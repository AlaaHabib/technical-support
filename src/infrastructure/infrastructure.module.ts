import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../domain/entities';

import { UserRepository } from './repositories';
const repos = [UserRepository];

@Module({
  imports: [TypeOrmModule.forFeature(Object.values(entities))],
  providers: [...repos],
  exports: [...repos],
})
export class InfrastructureModule {}
