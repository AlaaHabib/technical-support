import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketController } from './ticket.controller';
import { Module } from '@nestjs/common';
import { InfrastructureModule } from 'src/infrastructure/infrastructure.module';
import { Ticket } from 'src/domain/entities/ticket';
import { TicketService } from 'src/application/ticket/ticket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket]), InfrastructureModule],
  controllers: [TicketController],
  providers: [TicketService],
})
export class TicketModule {}
