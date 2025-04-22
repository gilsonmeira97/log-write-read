import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserValidator } from './dto/user-validator.dto';
import { Response } from 'express';
import { ResponseEntity } from './entities/ResponseEntity.entity';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("/install")
  create(@Body() createUserDto: CreateUserRequest, @Res() res: Response) {
    const userValidator: UserValidator = new UserValidator();
    userValidator.createUser(createUserDto);

    if(userValidator.hasError()){
      return res.status(HttpStatus.BAD_REQUEST).json(ResponseEntity.error(userValidator.messages))
    }
    
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
