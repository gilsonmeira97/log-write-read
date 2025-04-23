import { Injectable } from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { ResponseEntity } from '../../common/entities/ResponseEntity.entity';
import { User } from './entities/User.entity';
import * as bcrypt from 'bcrypt';



@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  
  async create(userRequest: CreateUserRequest) {
    let response: ResponseEntity = await this.verifyIfUserExists(userRequest);
    if(response.hasMessage()) return response;
    
    return response = await this.registerUser(userRequest);
  }

  update(updateUserDto: UpdateUserRequest) {
    return `This action updates a user`;
  }


  private async verifyIfUserExists(userRequest: CreateUserRequest) {
    const user = await this.prisma.user.findFirst({where: {email: userRequest.email} });
    if(user != null) return ResponseEntity.error(["Email is already in use."])
    else return new ResponseEntity()
  }

  private async registerUser(userRequest: CreateUserRequest) {
    const response: ResponseEntity = new ResponseEntity();

    // Maps the CreateUserRequest to a User
    const newUser: User = userRequest.mapperToUser();
    // Encrypt the password in the new User
    newUser.password = await bcrypt.hash(userRequest.password, 10);
    try{
      const savedUser = await this.prisma.user.create({data: newUser});
      return response.setData({id: savedUser.id, email: savedUser.email, name: savedUser.name});
    } catch(error: any) {
      return response.setMsg(["Error to create new user.", error.message]);
    }
  }
  
  async isInstalled() {
    const totalUsers = await this.prisma.user.count();
    return totalUsers != 0;
  }
}
