import { Module } from '@nestjs/common';
import { Jadwal } from './entity/jadwal.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JadwalController } from './jadwal.controller';
import { JadwalService } from './jadwal.service';
import { User } from 'src/auth/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Jadwal]),
        TypeOrmModule.forFeature([User])
    ],
    providers: [JadwalService],
    controllers: [JadwalController],
})
export class JadwalModule {}
