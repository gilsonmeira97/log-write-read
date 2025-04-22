import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserValidator } from './dto/user-validator.dto';
import { Response } from 'express';
import { ResponseEntity } from './entities/ResponseEntity.entity';

@Controller('api')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post("/install")
  async create(@Body() createUserDto: CreateUserRequest, @Res() res: Response) {
    let response: ResponseEntity = new ResponseEntity();
    const userValidator: UserValidator = new UserValidator();

    if(await this.userService.isInstalled()) return res.status(401).json(response.addMsg("This rute is disabled."))

    userValidator.createUser(createUserDto);

    if (userValidator.hasError()) {
      response.setMsg(userValidator.messages);
      return res.status(HttpStatus.BAD_REQUEST).json(response)
    }

    response = await this.userService.create(createUserDto);
    return res.status(response.hasMessage() ? 400 : 200).json(response)

  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

}
