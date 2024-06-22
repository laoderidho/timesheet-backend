import { Module } from '@nestjs/common';
import { Project } from './entity/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { User } from 'src/auth/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Project]),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [ProjectController],
    providers: [ProjectService],
})
export class ProjectModule {}
