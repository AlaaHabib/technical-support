import { UserRole } from './../../domain/entities/user/user-role.entity';
import { DataSource } from 'typeorm';
import { v4 as v4uuid } from 'uuid';
import * as argon from 'argon2';
import { Injectable } from '@nestjs/common';
import { User } from 'src/domain/entities/user/user.entity';
import { CustomRepository } from 'src/domain/repository/CustomBaseRepository';
import { CreateUserDto } from 'src/domain/dtos/user';
@Injectable()
export class UserRepository extends CustomRepository<User> {
  private _dataSource: DataSource;
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(User));
    this._dataSource = dataSource;
  }
  async Register(dto: CreateUserDto): Promise<User> {
    const { email, password, userRoleType } = dto;
    const salt = v4uuid();
    const passwordHash = await argon.hash(`${password}.${salt}`);
    const userRole: UserRole = await this._dataSource
      .getRepository(UserRole)
      .findOneBy({ name: userRoleType });
    const user = new User();
    await this._dataSource.transaction(async (em) => {
      Object.assign(user, {
        salt: salt,
        createdAt: new Date(),
        passwordHash,
        email,
        userRole,
      });
      return await em.save(User, user);
    });
    return user;
  }
}
