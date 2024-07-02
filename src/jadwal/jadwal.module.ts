import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { Jadwal } from './entity/jadwal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JadwalController } from './jadwal.controller';
import { JadwalService } from './jadwal.service';
import { User } from 'src/auth/entities/user.entity';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

@Module({
    imports: [
        TypeOrmModule.forFeature([Jadwal]),
        TypeOrmModule.forFeature([User])
    ],
    providers: [JadwalService],
    controllers: [JadwalController],
})
export class JadwalModule {
    configure(consumer: MiddlewareConsumer){
        consumer
            .apply(AuthMiddleware)
            .forRoutes({path: 'jadwal/*', method: RequestMethod.ALL})
    }
}
