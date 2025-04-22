import { CreateUserRequest } from "./create-user.dto";

export class UserValidator {
    messages: string[] = []

    createUser(user: CreateUserRequest) {
        this.name(user.name).email(user.email).password(user.password);

        return this.messages;
    }

    appendMsg(msg: string) {
        this.messages.push(msg);
    }

    hasError() {
        return this.messages.length == 0 ? false : true;
    }

    name(name: string) {
        if (name == null || name.length < 5) this.appendMsg("Nome inválido - Deve conter ao menos 5 caracteres.")
        return this;
    }
    
    email(email: string) {
        if (email == null || !email.match("^[\\w.-]+@([a-zA-Z-]+\\.)+[a-zA-Z]{2,}$")) {
            this.appendMsg("Email inválido - Deve seguir o padrão example@example.com");
        }
        return this;
    }

    password(password: string) {
        if (password == null || password.length < 8) {
            this.appendMsg("Senha inválida - Deve ter pelo menos 8 caracteres.");
        }
        return this;
    }

}