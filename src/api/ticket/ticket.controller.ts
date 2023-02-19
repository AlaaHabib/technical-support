import {
  ForbiddenException,
  HttpStatus,
  Query,
  UseGuards,
} from "@nestjs/common";
import { Controller, Get, Param, Delete, Post, Body } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { PaginationResult } from "src/domain/interfaces/pagination.result.interface";
import { Patch } from "@nestjs/common/decorators";
import { Res } from "@nestjs/common/decorators";
import { Response } from "express";
import { AccessTokenGuard } from "src/application/auth/guards";
import { TicketService } from "src/application/ticket/ticket.service";
import { UsersRoles } from "src/domain/entities/enums";
import { CurrentUser } from "src/domain/decorators/request-user.decorator";
import { CreateTicketDto } from "src/domain/dtos/ticket";
import { AssignTicketDto } from "src/domain/dtos/ticket/assign-ticket.dto";

const routBase = "ticket";

@ApiTags(routBase)
@Controller(routBase)
@ApiBearerAuth("JWT-auth")
@UseGuards(AccessTokenGuard)
export class TicketController {
  constructor(private service: TicketService) {}

  @Post()
  @ApiOperation({ summary: "Create new ticket" })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: "Forbidden." })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "The record has been successfully created.",
  })
  async create(@Body() dto: CreateTicketDto, @CurrentUser() user) {
    if (user.role == UsersRoles.ADMIN)
      return await this.service.createTicket(dto);
    else throw new ForbiddenException("You don't have permission");
  }

  @Get(':id')
  @ApiOperation({ summary: 'get ticket by id ' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'ticket .',
  })
  @ApiParam({ name: 'id', description: 'ticket id' })
  async getById(
    @Param() { id },
  ) {
    return await this.service.getTicketById(id);

  }

  @Patch("assign/:id")
  @ApiOperation({ summary: "assign user to ticket" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Not Found." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The user has been successfully assigned.",
  })
  @ApiParam({ name: "id", description: "ticket id" })
  async assign(
    @Param() { id },
    @Body() dto: AssignTicketDto,
    @Res() response: Response,
    @CurrentUser() user
  ) {
    if (user.role == UsersRoles.ADMIN) {
      await this.service.assign(id, dto);
      response.send({
        statusCode: HttpStatus.OK,
        message: "User assigned successfully",
      });
    } else throw new ForbiddenException("You don't have permission");
  }

  @Patch("accept/:id")
  @ApiOperation({ summary: "accept user to ticket" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Not Found." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The ticket has been successfully accepted.",
  })
  @ApiParam({ name: "id", description: "ticket id" })
  async accept(
    @Param() { id },
    @Res() response: Response
  ) {
      await this.service.accept(id);
      response.send({
        statusCode: HttpStatus.OK,
        message: "User accepted successfully",
      });
  }

  @Patch("resolve/:id")
  @ApiOperation({ summary: "resolve user to ticket" })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: "Not Found." })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "The ticket has been successfully resolved.",
  })
  @ApiParam({ name: "id", description: "ticket id" })
  async resolve(
    @Param() { id },
    @Res() response: Response
  ) {
      await this.service.resolve(id);
      response.send({
        statusCode: HttpStatus.OK,
        message: "Ticket resolve successfully",
      });
  }

  @Get('/:index/:size')
  @ApiOperation({ summary: 'Get all tickets created  with pagination ' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Users.' })
  @ApiParam({ name: 'size', description: "the count of results per page'" })
  @ApiParam({
    name: 'index',
    description: "the index of next page 'started from 1'",
  })
  async getUsers(
    @Param() params: any /*, @Req() req: Request*/,
  ): Promise<PaginationResult> {
    return await this.service.getAll(params);
  }
}
