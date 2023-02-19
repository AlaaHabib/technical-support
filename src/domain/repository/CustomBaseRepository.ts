import {
  DeepPartial,
  EntityManager,
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsWhere,
  InsertResult,
  Repository,
  SaveOptions,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { Request } from 'express';
import { IsArray } from 'class-validator';
import { PaginationResult } from '../interfaces/pagination.result.interface';
import { BaseRecord } from '../entities/base-tables';
export class CustomRepository<Entity extends BaseRecord> {
  constructor(private repository: Repository<Entity>) {}
  async DoTransaction<T>(
    fn: (entityManager: EntityManager) => Promise<T>,
  ): Promise<T> {
    return await this.repository.manager.transaction(fn);
  }
  /**
   * Get Data Pagination from table with including and select
   * @param index page number starting from 0
   * @param length page length or number of rows ber page
   * @param order ordering rows ex: {createdAt: 'DESC'}
   * @param where filtering ex: { isActive: true }
   * @param relations spiffily the included tables ex: { category , category.subCategory}
   * @param select select columns from table and related tables ex: {id: true, name: true, category:{name: true}, subCategory:{name: true}  }
   * @returns type of PaginationResult
   */
  async findPagination(
    index: number,
    length: number,
    order: FindOptionsOrder<Entity>,
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    select?: FindOptionsSelect<Entity>,
    relations?: FindOptionsRelations<Entity>,
  ): Promise<PaginationResult> {
    const result: [Entity[], number] = await this.repository.findAndCount({
      relations,
      where,
      order,
      select,
      take: length,
      // skip: index * length,
      skip: (index - 1) * length,
    });
    return { count: result[1], data: result[0] };
  }
  async find(
    order?: FindOptionsOrder<Entity>,
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    select?: FindOptionsSelect<Entity>,
    relations?: FindOptionsRelations<Entity>,
  ): Promise<Entity[]> {
    return await this.repository.find({
      relations,
      where,
      order,
      select,
    });
  }
  async findOne(options: FindOneOptions<Entity>): Promise<Entity> {
    return await this.repository.findOne(options);
  }
  async findOneBy(
    where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[],
    select?: FindOptionsSelect<Entity>,
  ): Promise<Entity> {
    const res = await this.repository.find({
      where,
      select,
      take: 1,
    });
    return res[0];
  }
  async insert(
    entity: QueryDeepPartialEntity<Entity> | QueryDeepPartialEntity<Entity>[],
  ): Promise<InsertResult> {
    // const req: Request = RequestContext.currentContext.req;
    // Object.assign(entity, { createdBy: req.user['id'] });
    return await this.repository.insert(entity);
  }
  //async updateOrInsert(entityOrEntities: DeepPartial<Entity>, options?: SaveOptions): Promise<DeepPartial<Entity>>;
  async insertOrUpdateMany(
    entities: DeepPartial<Entity>[],
  ): Promise<DeepPartial<Entity>[]>;
  async insertOrUpdateMany(
    entities: DeepPartial<Entity>[],
    options?: SaveOptions,
  ): Promise<DeepPartial<Entity>[]> {
    return await this.repository.save(entities, options);
  }
  // update
  async archive(idOrIds: number | string[] | FindOptionsWhere<Entity>) {
    return await this.repository.softDelete(idOrIds);
  }
  async delete(idOrIds: number | string[] | FindOptionsWhere<Entity>) {
    return await this.repository.delete(idOrIds);
  }
  async restore(idOrIds: string | string[] | FindOptionsWhere<Entity>) {
    return await this.repository.restore(idOrIds);
  }
  async update(
    idOrIds: string | string[] | FindOptionsWhere<Entity>,
    partialEntity: QueryDeepPartialEntity<Entity>,
  ) {
    // const req: Request = RequestContext.currentContext.req;
    // Object.assign(partialEntity, { createdBy: req.user['id'] });
    return await this.repository.update(idOrIds, partialEntity);
  }
  // async count(idOrIds: string | string[] | FindOptionsWhere<Entity>) {
  //   return await this.repository.restore(idOrIds);
  // }
  async countBy(where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[]) {
    return await this.repository.countBy(where);
  }

  async save(entity: DeepPartial<Entity>) {
    return await this.repository.save(entity);
  }
  async merge(
    mergeIntoEntity: Entity,
    ...entityLikes: DeepPartial<Entity>[]
  ): Promise<Entity> {
    return await this.repository.merge(mergeIntoEntity, ...entityLikes);
  }
}
