import { Column, PrimaryGeneratedColumn } from 'typeorm';

export abstract class BaseHelpTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: false })
  name: string;
}
