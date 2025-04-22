import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ResponseEntity } from 'src/user/entities/ResponseEntity.entity';
import * as bcrypt from 'bcrypt';

type Login = {email: string, password: string}

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService){}

    async login({email, password}: Login) {
        const response: ResponseEntity = new ResponseEntity();
        const findedUser = await this.prisma.user.findUnique({where: {email: email}});

        if(!!findedUser && await bcrypt.compare(password, findedUser.password)) {
            return response.setData(true);
        } else {
            return response.addMsg("Email or password invalid.");
        }
    }
}
