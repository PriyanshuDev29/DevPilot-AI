import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UsersService } from 'src/users/users.service';
import { AuthenticatedUser } from '../interfaces/authenticated-user.interface';

@Injectable()
//Internally, Nest registers it with the name: jwt
export class JwtStrategy extends PassportStrategy(Strategy) {           // PassportStrategy is a generic class that takes a strategy as a parameter. In this case, we are using the JWT strategy. It integrates the JWT strategy with Passport, allowing us to use JWT for authentication in our NestJS application.
	
    constructor(configService: ConfigService, private readonly usersService: UsersService) {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
            throw new Error('JWT_SECRET is not configured');
        }
        super({                                                             // super configures the JWT strategy.
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),       // Look for the JWT In the Authorization header, as a Bearer token.
            ignoreExpiration: false,                                        // Dont expect expired JWTs to be valid.
            secretOrKey: secret,
        });
    }
    
    async validate(payload: JwtPayload) {                                   // The validate method is called automatically by Passport when a request is made with a valid JWT. It receives the decoded JWT payload as an argument. This method should return the user object that will be attached to the request object.

        const user = await this.usersService.findById(payload.sub);

        if(user==null){
            throw new UnauthorizedException('User not found');
        }

        const authenticatedUser: AuthenticatedUser = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
        };

        return authenticatedUser;
    }                                  
}