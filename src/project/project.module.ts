import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { Project } from './entity/project.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { User } from 'src/auth/entities/user.entity';
import { AuthMiddleware } from 'src/middleware/auth.middleware';

@Module({
    imports: [
        TypeOrmModule.forFeature([Project]),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [ProjectController],
    providers: [ProjectService],
})
export class ProjectModule {
    configure(consumer: MiddlewareConsumer){
        consumer
            .apply(AuthMiddleware)
            .forRoutes({path: 'project/*', method: RequestMethod.ALL})
    }
}
