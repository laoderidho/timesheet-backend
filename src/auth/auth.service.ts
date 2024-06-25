import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User } from "./entities/user.entity";
import { RegisterDto } from "./dto/register.dto";
import * as bcrypt from 'bcryptjs';
import { JwtService } from "@nestjs/jwt";
import { LoginDto } from "./dto/login.dto";
import { UpdateDto } from "./dto/update.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService : JwtService
    ){}

    async register(register: RegisterDto){
        const passwordHash = await bcrypt.hash(register.password, 10);
        try {
            const newUser = this.userRepository.create({
                ...register,
                password: passwordHash
            });
            return await this.userRepository.save(newUser);
        } catch (error) {
             if (error.code === 'ER_DUP_ENTRY') {
                 throw new BadRequestException('Email sudah terdaftar');
            } else {
                throw error; 
            }
        }
    } 

    async login(login: LoginDto){
        const { email, password } = login;

        const user = await this.userRepository.findOne({ where: { email } });

        if(!user){
            throw new UnauthorizedException('Email dan kata sandi salah')
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if(!isPasswordMatch){
            throw new UnauthorizedException('Email dan kata sandi salah')
        }

        const payload = { sub: user.id, email: user.email };

        return {
            access_token: this.jwtService.sign(payload)
        };
    }


    async getProfile(token: string){
       try {
        const payload = this.jwtService.verify(token);
        const user = await this.userRepository.findOne({ where: { email: payload.email}});
        if(!user){
            throw new NotFoundException('User tidak ditemukan');
        }
        return {
            name: user.name,
            rate: user.rate
        };
       } catch (error) {
            throw new UnauthorizedException('sesi telah berakhir');
       }
    }

    async updateProfile(token: string, data: UpdateDto){
        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userRepository.findOne({ where: { email: payload.email}});
            if(!user){
                throw new NotFoundException('User tidak ditemukan');
            }
            await this.userRepository.update(user.id, data);
            return {
                message: 'User berhasil diupdate'
            };
        } catch (error: any) {
            throw new UnauthorizedException(error);
        }
    }
}