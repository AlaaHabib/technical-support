import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTicketDto } from 'src/domain/dtos/ticket';
import { AssignTicketDto } from 'src/domain/dtos/ticket/assign-ticket.dto';
import { CustomException } from 'src/domain/exceptions/custom.exception';
import { TicketRepository } from 'src/infrastructure/repositories/ticket.repository';
import { IsNull } from 'typeorm';


@Injectable()
export class TicketService {
  constructor(private repo: TicketRepository) {}

  async createTicket(dto: CreateTicketDto) {
    try {
      return  await this.repo.Create(dto);
    } catch (error) {
        throw new CustomException(error,error?.driverError?.details);
    }
  }

  async assign(id,dto: AssignTicketDto) {
    try {
      return  await this.repo.update(id , {user:{id:dto.userId}});
    } catch (error) {
        throw new CustomException(error,error?.driverError?.details);
    }
  }
  async accept(id) {
    try {
      return  await this.repo.update(id , {accept:true});
    } catch (error) {
        throw new CustomException(error,error?.driverError?.details);
    }
  }
  async resolve(id) {
    try {
      return  await this.repo.update(id , {resolve:true});
    } catch (error) {
        throw new CustomException(error,error?.driverError?.details);
    }
  }

 async getAll(params) {
  const pageIndex = Number(params.index);
  let limit = Number(params.size);
  if (limit < 1 || pageIndex < 1)
    throw new BadRequestException('Enter valid data');
  
  return await this.repo.findPagination(
    pageIndex,
    limit,
    { id: 'DESC' },
    {deletedAt : IsNull() },

    {
      id: true,
      name:true,
      resolve:true,
      accept:true,
      user:{id:true , email:true}
    },
    { user: true},
  );

}

async getTicketById(id) {
  const ticket = await this.repo.findOneBy({ id });
  if (ticket) return ticket;
  throw new NotFoundException('Ticket Not found');
}

}
