import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService, 
        private readonly jwtService: JwtService, 
        private readonly configService: ConfigService

    ) {}

    async register(registerDto: RegisterDto): Promise<any> {
        let userExist = await this.usersService.findByEmail(registerDto.email);
        if(userExist)  throw new ConflictException('User with this email already exists');


        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
            const user = await this.usersService.create({
                email: registerDto.email,
                password: hashedPassword,
                lastName: registerDto.lastName,
                firstName: registerDto.firstName,
                role: registerDto.role ,
            });

            const payload = { sub: user.id, lastname: user.lastName, role: user.role , email: user.email };
            const token = await this.jwtService.signAsync(payload);

            return {
                id: user.id,
                email: user.email,
                access_token: token,
            };       
    }


    async login(loginDto: LoginDto): Promise<any> {
        const user = await this.usersService.findByEmail(loginDto.email);
       
        
        if (!user) {
            throw new ConflictException('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new ConflictException('Invalid email or password');
        }

        const payload = { sub: user.id, lastname: user.lastName, role: user.role, email: user.email };
        const token = await this.jwtService.signAsync(payload);

        return {
           success: true,   
            access_token: token,
        };
    }
}
