import { Body, Controller, Post, Res } from '@nestjs/common';
import { UserValidator } from 'src/user/dto/user-validator.dto';
import { LoginUserRequest } from './dto/login-user.dto';
import { Response } from 'express';
import { ResponseEntity } from 'src/user/entities/ResponseEntity.entity';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService ){}

    @Public()
    @Post("/login")
    async login(@Body() request: LoginUserRequest, @Res() res: Response) {
        let response: ResponseEntity = new ResponseEntity();
        const userValidator = new UserValidator().loginUser(request);
        if(userValidator.hasError()) {
            response.setMsg(userValidator.messages);
            return res.status(400).json(response);
        }
        
        response = await this.authService.login(request);

        return res.status( response.hasMessage() ? 400 : 200 ).json(response);

    }
}
