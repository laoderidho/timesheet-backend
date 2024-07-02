import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class AuthMiddleware implements NestMiddleware{

    constructor(private readonly jwtService: JwtService){}

    async use(req: Request, res: Response, next: NextFunction){
       const header = req.headers['authorization']

       if(!header){
            throw new UnauthorizedException('Anda Tidak Bisa Mengakses ini')
       }

       const token = header

       if(!token){
            throw new UnauthorizedException('Anda Tidak Bisa Mengakses ini')
       }

       try {
            const decode = this.jwtService.verify(token)
            if(!decode){
                throw new UnauthorizedException('Sesi Anda Telah Berakhir')
            }
            next()
       } catch (error) {
            return res.status(401).json({
                message: error
            })
       }
    }
}