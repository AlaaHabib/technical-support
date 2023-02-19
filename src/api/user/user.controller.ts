import { HttpStatus, Query, UseGuards } from '@nestjs/common';
import { Controller, Get, Param, Delete, Post, Body } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationResult } from 'src/domain/interfaces/pagination.result.interface';
import { Patch } from '@nestjs/common/decorators';
import { Res } from '@nestjs/common/decorators';
import { Response } from 'express';
import { AccessTokenGuard } from 'src/application/auth/guards';
import { CreateUserDto, UpdateUserDto } from 'src/domain/dtos/user';
import { UserService } from 'src/application/user/user.service';

const routBase = 'user';

@ApiTags(routBase)
@Controller(routBase)
@ApiBearerAuth('JWT-auth')
@UseGuards(AccessTokenGuard)
export class UserController {
  constructor(private service: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
  })
  async create(@Body() dto: CreateUserDto) {
    return await this.service.createUser(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get user by id ' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'user .',
  })
  @ApiParam({ name: 'id', description: 'user id' })
  async getById(
    @Param() { id },
  ) {
    return await this.service.getUserById(id);
    
  }

  @Patch(':id')
  @ApiOperation({ summary: 'update user' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully updated.',
  })
  @ApiParam({ name: 'id', description: 'user id' })
  async update(
    @Param() { id },
    @Body() dto: UpdateUserDto,
    @Res() response: Response,
  ) {
    await this.service.updateUser(id, dto);
    response.send({
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete specific user' })
  @ApiNotFoundResponse({ status: HttpStatus.NOT_FOUND, description: 'Not Found.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user has been successfully deleted..',
  })
  @ApiParam({ name: 'id', description: "user id'" })

  async destroy(
    @Res() response: Response,
    @Param() { id }: any,
  ) {
    await this.service.deleteUser(id);
    response.send({
      statusCode: HttpStatus.OK,
      message: 'User deleted successfully',
    });
  }

  @Get('/:index/:size')
  @ApiOperation({ summary: 'Get all users created  with pagination ' })
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
