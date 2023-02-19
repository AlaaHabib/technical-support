import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';
import { RequestScopeData } from 'src/domain/models/request-scope-data.model';
import { CustomLogger } from 'src/domain/helpers';


export abstract class BaseInsert {
  @Column({ nullable: true })
  createdBy?: string;
  @CreateDateColumn()
  createdAt?: Date;
  @BeforeInsert()
  addUser?() {
    const context = RequestScopeData.currentContext;
    CustomLogger({ context });
    if (context && context.id) {
      this.createdBy = RequestScopeData.currentContext.id;
    }
  }
}
export abstract class BaseUpdate extends BaseInsert {
  @Column({ nullable: true })
  updatedBy?: string;
  @UpdateDateColumn()
  updatedAt?: Date;
  @BeforeUpdate()
  UpdateUser?() {
    const context = RequestScopeData.currentContext;
    CustomLogger({ context });
    if (context && context.id) {
      this.updatedBy = RequestScopeData.currentContext.id;
    }
  }
}
export abstract class BaseRecord extends BaseUpdate {
  @DeleteDateColumn()
  deletedAt?: Date;
}
