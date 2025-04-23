import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { UserValidator } from '../../common/validators/user.validator';
import { Request, Response } from 'express';
import { ResponseEntity } from '../../common/entities/ResponseEntity.entity';
import { Public } from 'src/decorators/public.decorator';
import { LoginUserRequest } from 'src/modules/auth/dto/login-user.dto';
import { User } from './entities/User.entity';
import { UserAuth } from 'src/decorators/userAuth.decorator';

@Controller("api/")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public()
  @Post("install")
  async create(@Body() createUserDto: CreateUserRequest, @Res() res: Response) {
    let response: ResponseEntity = new ResponseEntity();
    const userValidator: UserValidator = new UserValidator();

    if(await this.userService.isInstalled()) return res.status(401).json(response.addMsg("This service is disabled."));

    userValidator.createUser(createUserDto);

    if (userValidator.hasError()) {
      response.setMsg(userValidator.messages);
      return res.status(HttpStatus.BAD_REQUEST).json(response);
    }

    response = await this.userService.create(createUserDto);
    return res.status(response.hasMessage() ? 400 : 200).json(response);

  }

  @Patch("user")
  update(@Body() userRequest: UpdateUserRequest, @UserAuth() userAuth) {
    // TODO CREATE IMPLEMENT THIS UPDATE METHOD.
    return this.userService.update(userRequest);
  }

}
