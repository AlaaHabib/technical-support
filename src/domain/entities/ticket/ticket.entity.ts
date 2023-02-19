import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Generated,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { BaseRecord } from '../base-tables/base-record';
import { User } from '../user';

@Entity('tickets')
export class Ticket extends BaseRecord {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column()
  name: string;

  @Column({ default: false })
  accept: boolean;

  @Column({ default: false })
  resolve: boolean;

  // relations
  @OneToOne(() => User, (user) => user.ticket) 
  @JoinColumn({ name: 'userId' })
  user?: User;

}
