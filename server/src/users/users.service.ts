import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/users.schema';
import { CreateUserData } from './interfaces/create-user-data.interface';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}         // Readonly because we dont want the injected dependencies to change later.

    async create(createUserDto: CreateUserData): Promise<User> {
        const user = new this.userModel(createUserDto);
        return await user.save();
    }

    async findByEmail(email:string): Promise<User | null> {
        const user = await this.userModel.findOne({email}).exec();
        return user;
    }

    async findById(id: string): Promise<User | null> {
        const user = await this.userModel.findById(id).exec();
        return user;
    }

}
