import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../../application/user/user.service';
import { UserController } from './user.controller';
import { Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { User } from 'src/domain/entities/user';

@Module({
  imports: [TypeOrmModule.forFeature([User]), InfrastructureModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
