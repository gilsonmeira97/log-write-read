import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRequest } from './create-user.dto';

export class UpdateUserRequest extends PartialType(CreateUserRequest) {
    name: string;
}
