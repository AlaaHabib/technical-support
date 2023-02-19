import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/domain/dtos/user';
import { UsersRoles } from 'src/domain/entities/enums';
import { CustomException } from 'src/domain/exceptions/custom.exception';
import { UserRepository } from 'src/infrastructure/repositories';


@Injectable()
export class UserService {
  constructor(private repo: UserRepository) {}

  async createUser(dto: CreateUserDto) {
    try {
      return  await this.repo.Register(dto);
    } catch (error) {
        throw new CustomException(error,error?.driverError?.details);
    }
  }
 async updateUser(id,data) {
  try {
    return  await this.repo.update(id,data);
  } catch (error) {
      throw new CustomException(error,error?.driverError?.details);
  }
 }
 async deleteUser(id) {
  try {
    return  await this.repo.delete(id);
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
    {userRole : {name:UsersRoles.USER} },

    {
      id: true,
      email:true,
      userRole:{id:true,name:true}
    },
    { userRole: true},
  );

}

async getUserById(id) {
  const user = await this.repo.findOneBy({ id });
  if (user) return user;
  throw new NotFoundException('User Not found');
}

}
