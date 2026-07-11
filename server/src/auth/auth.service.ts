import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService, private readonly jwtService:JwtService) {}

    async register(registerDto: RegisterUserDto){
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if(existingUser!=null){
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        
        const createUserDto = {
            ...registerDto,
            password: hashedPassword
        }

        const user = await this.usersService.create(createUserDto);

        const payload = {
            sub: user._id,
            email: user.email
        }

        const accessToken = await this.jwtService.signAsync(payload);
        
        return {
            message: 'User registered successfully',
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        };
    }
}
