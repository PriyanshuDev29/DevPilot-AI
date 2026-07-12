import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login.dto';
import { User } from 'src/users/schemas/users.schema';

@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService, private readonly jwtService:JwtService) {}

    private async generateAuthResponse(user: User) {
        const payload = {
            sub: user._id,
            email: user.email
        }

        const accessToken = await this.jwtService.signAsync(payload);

        return {
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        }
    }

    async register(registerDto: RegisterUserDto){
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if(existingUser){
            throw new ConflictException('Email already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        
        const createUserDto = {
            ...registerDto,
            password: hashedPassword
        }

        const user = await this.usersService.create(createUserDto);

        return await this.generateAuthResponse(user);
    }

    async login(loginDto: LoginUserDto){
        const user = await this.usersService.findByEmail(loginDto.email);
        if(!user){
            throw new UnauthorizedException('Username or password is incorrect');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if(!isPasswordValid){
            throw new UnauthorizedException('Username or password is incorrect');
        }
        
        return await this.generateAuthResponse(user);
    }
}

//Checking
