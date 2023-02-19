import { User } from './../../domain/entities/user/user.entity';
import { UserRole } from './../../domain/entities/user/user-role.entity';
import { DataSource } from 'typeorm';
import { RequestScopeData } from 'src/domain/models/request-scope-data.model';
import { AsyncLocalStorage } from 'async_hooks';
import { UsersRoles } from 'src/domain/entities/enums/users-role.enum';
import { UserRepository } from '../repositories';
// import { ItemTypes } from 'src/domain/entities/enums/item-type.enum';

// TODO: add class logs
export class ProductionSeeder {
  private userRepo: UserRepository;
  constructor(private readonly dataSource: DataSource) {
    this.userRepo = new UserRepository(dataSource);
  }

  public async seed() {
    console.log('start seed for production');
    await this.createRoles();
    await this.createRoot();

    console.log('production data seeded');
  }

  private async createRoles() {
    const userRole: UserRole[] = [
      { name: UsersRoles.Root },
      { name: UsersRoles.User },
    ];

    await this.dataSource.manager.insert<UserRole>(UserRole, userRole);
  }

  private async createRoot() {
    const adminRole = await this.dataSource.manager.findOne<UserRole>(
      UserRole,
      { where: { name: UsersRoles.Root } },
    );
    const data = {
      email: 'admin@admin.com',
      password: '123456',
      userRoleId: adminRole.id,
      isRoot:true
    };
    return await this.userRepo.Register(data);
  }
}
