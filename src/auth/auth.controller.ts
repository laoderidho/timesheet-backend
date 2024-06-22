import { Controller, Body, Post, Headers, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdateDto } from "./dto/update.dto";

@Controller('auth')
export class AuthController{
    constructor(
        private authService: AuthService
    ){}

    @Post('register')
    async register(@Body() register: RegisterDto){
        return this.authService.register(register);
    }

    @Post('login')
    async login(@Body() login: LoginDto){
        return this.authService.login(login);
    }

    @Get('profile')
    async profile(@Headers('Authorization') authHeader: string){
        return this.authService.getProfile(authHeader);
    }

    @Post('update')
    async update(@Headers('Authorization') authHeader: string, @Body() update: UpdateDto){
        return this.authService.updateProfile(authHeader, update);
    }
}