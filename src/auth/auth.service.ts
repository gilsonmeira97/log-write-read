import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ResponseEntity } from 'src/user/entities/ResponseEntity.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserRequest } from './dto/login-user.dto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async login(loginUser: LoginUserRequest) {
        const response: ResponseEntity = new ResponseEntity();
        const findedUser = await this.prisma.user.findUnique({ where: { email: loginUser.email } });

        if (findedUser && await bcrypt.compare(loginUser.password, findedUser.password)) {
            const payload = { sub: findedUser.id, email: findedUser.email };
            return response.setData(await this.jwtService.signAsync(payload));
        } else {
            return response.addMsg("Email or password invalid.");
        }
    }
}
