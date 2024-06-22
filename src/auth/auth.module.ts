import { Module } from '@nestjs/common';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm/dist';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from '../config/jwt.config';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            global: true,
            secret: jwtConfig,
            signOptions: { expiresIn: '3h' }
        })
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
