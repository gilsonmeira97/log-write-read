import { User } from "../entities/User.entity";

export class CreateUserRequest {
    name: string;
    email: string;
    password: string;

    mapperToUser() {
        const mappedUser = new User();

        mappedUser.name = this.name;
        mappedUser.email = this.email;
        mappedUser.password = this.password;
        
        return mappedUser;
    }
}
