import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Generated,
  OneToOne,
} from 'typeorm';
import { BaseRecord } from '../base-tables/base-record';
import { Ticket } from '../ticket';
import { UserRole } from './user-role.entity';

@Entity('users')
export class User extends BaseRecord {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  salt: string;

  @Column({ nullable: true })
  refreshToken?: string;

  @Column({ default: true })
  isActive: boolean;

  // relations
  @ManyToOne(() => UserRole, (userRole) => userRole.users)
  userRole: UserRole;

  @OneToOne(() => Ticket, (ticket) => ticket.user, { cascade: true }) 
  ticket?: Ticket;
}
