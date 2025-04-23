import { LoginUserRequest } from "src/modules/auth/dto/login-user.dto";
import { CreateUserRequest } from "../../modules/user/dto/create-user.dto";

export class UserValidator {
    messages: string[] = []

    createUser(user: CreateUserRequest) {
        this.name(user.name).email(user.email).password(user.password);
        return this;
    }

    loginUser(user: LoginUserRequest) {
        this.email(user.email).password(user.password);
        return this;
    }

    appendMsg(msg: string) {
        this.messages.push(msg);
    }

    hasError() {
        return this.messages.length == 0 ? false : true;
    }

    name(name: string) {
        if (name == null || name.length < 5) this.appendMsg("Invalid name - Must contain at least 5 characters.")
        return this;
    }
    
    email(email: string) {
        if (email == null || !email.match("^[\\w.-]+@([a-zA-Z-]+\\.)+[a-zA-Z]{2,}$")) {
            this.appendMsg("Invalid email - Must follow the pattern example@example.com");
        }
        return this;
    }

    password(password: string) {
        if (password == null || password.length < 8) {
            this.appendMsg("Invalid password - Must be at least 8 characters long.");
        }
        return this;
    }

}