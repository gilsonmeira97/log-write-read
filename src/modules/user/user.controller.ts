import { Controller, Get, Post, Body, Patch, Param, Delete, Res, HttpStatus, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequest } from './dto/create-user.dto';
import { UpdateUserRequest } from './dto/update-user.dto';
import { UserValidator } from '../../common/validators/user.validator';
import { Request, Response } from 'express';
import { ResponseEntity } from '../../common/entities/ResponseEntity.entity';
import { Public } from 'src/decorators/public.decorator';
import { LoginUserRequest } from 'src/modules/auth/dto/login-user.dto';
import { UserAuth } from 'src/decorators/userAuth.decorator';
import { UserToken } from '../auth/entities/UserToken';

@Controller("api/")
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public()
  @Post("install")
  async create(@Body() createUserRequest: CreateUserRequest, @Res() res: Response) {
    let response: ResponseEntity = new ResponseEntity();
    const userValidator: UserValidator = new UserValidator().createUser(createUserRequest);

    if(await this.userService.isInstalled()) return res.status(401).json(response.addMsg("This service is disabled."));

    if (userValidator.hasError()) {
      return res.status(HttpStatus.BAD_REQUEST).json(response.setMsg(userValidator.messages));
    }

    response = await this.userService.create(createUserRequest);
    return res.status(response.hasMessage() ? 400 : 200).json(response);

  }

  @Patch("user")
  async update(@Body() updateUserRequest: UpdateUserRequest, @UserAuth() userToken: UserToken, @Res() res) {
    let response: ResponseEntity = new ResponseEntity();
    const userValidator: UserValidator = new UserValidator().updateUser(updateUserRequest);

    if (userValidator.hasError()) {
      return res.status(HttpStatus.BAD_REQUEST).json(response.setMsg(userValidator.messages));
    }
    // TODO CREATE IMPLEMENT THIS UPDATE METHOD.
    response = await this.userService.update(updateUserRequest, userToken)
    return res.status(response.hasMessage() ? 500 : 200).json(response);
  }
}
