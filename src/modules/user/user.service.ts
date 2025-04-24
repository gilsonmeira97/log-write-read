import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { ResponseEntity } from '../../common/entities/ResponseEntity.entity';
import { User } from './entities/User.entity';
import * as bcrypt from 'bcrypt';
import { UserToken } from '../auth/entities/UserToken';



@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(userRequest: CreateUserRequest) {
    let response: ResponseEntity = await this.verifyIfUserExists(userRequest);
    if (response.hasMessage()) return response;

    return response = await this.registerUser(userRequest);
  }

  async update(userRequest: UpdateUserRequest, userToken: UserToken) {
    let response: ResponseEntity = new ResponseEntity();
    try {
      const formatedUser = await this.formatUpdateUser(userRequest);
      const updatedUser = await this.prisma.user.update({ 
        where: { id: userToken.id }, 
        data: {...formatedUser} 
      })
      return response.setData({name: updatedUser.name, email: updatedUser.email});
    } catch (error) {
      return response.addMsg("Failed to update user.")
    }
  }

  async isInstalled() {
    const totalUsers = await this.prisma.user.count();
    return totalUsers != 0;
  }

  private async encryptPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  private async verifyIfUserExists(userRequest: CreateUserRequest) {
    const user = await this.prisma.user.findFirst({ where: { email: userRequest.email } });
    if (user != null) return ResponseEntity.error(["Email is already in use."])
    else return new ResponseEntity()
  }

  private async registerUser(userRequest: CreateUserRequest) {
    const response: ResponseEntity = new ResponseEntity();

    // Maps the CreateUserRequest to a User
    const newUser: User = userRequest.mapperToUser();
    // Encrypt the password in the new User
    newUser.password = await this.encryptPassword(userRequest.password);
    try {
      const savedUser = await this.prisma.user.create({ data: newUser });
      return response.setData({ id: savedUser.id, email: savedUser.email, name: savedUser.name });
    } catch (error: any) {
      return response.setMsg(["Error to create new user.", error.message]);
    }
  }

  private async formatUpdateUser(userRequest: UpdateUserRequest) {
    let formatedUser: UpdateUserRequest = {}
    if(userRequest.name) formatedUser.name = userRequest.name;
    if(userRequest.password) formatedUser.password = await this.encryptPassword(userRequest.password);
    return formatedUser;
  }

}
