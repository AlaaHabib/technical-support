import { DataSource } from 'typeorm';
import { v4 as v4uuid } from 'uuid';
import * as argon from 'argon2';
import { Injectable } from '@nestjs/common';
import { CustomRepository } from 'src/domain/repository/CustomBaseRepository';
import { Ticket } from 'src/domain/entities/ticket';
import { CreateTicketDto } from 'src/domain/dtos/ticket';
@Injectable()
export class TicketRepository extends CustomRepository<Ticket> {
  private _dataSource: DataSource;
  constructor(dataSource: DataSource) {
    super(dataSource.getRepository(Ticket));
    this._dataSource = dataSource;
  }
  async Create(dto: CreateTicketDto): Promise<Ticket> {
    const { name } = dto;

    const ticket = new Ticket();
    await this._dataSource.transaction(async (em) => {
      Object.assign(ticket, {
        createdAt: new Date(),
        name,
      });
      return await em.save(Ticket, ticket);
    });
    return ticket;
  }
}
