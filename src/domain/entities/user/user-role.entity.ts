import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseRecord } from '../base-tables/base-record';
import { User } from './user.entity';
import { UsersRoles } from '../enums/users-role.enum';

@Entity('user_roles')
export class UserRole extends BaseRecord {
  @PrimaryGeneratedColumn('increment', {type: 'bigint'} )
    id?: number;

  @Column({
    type: 'simple-enum',
    enum: UsersRoles,
  })
  name: string;


  // relations
  @OneToMany(() => User, (user) => user.userRole, { onDelete: 'NO ACTION' })
  users?: User[];
  
}
