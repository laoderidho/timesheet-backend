import { Repository } from "typeorm";
import { AddProjectDto } from "./dto/add-project.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Project } from "./entity/project.entity";
import { JwtService } from "@nestjs/jwt";


@Injectable()
export class ProjectService{
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        private jwtService: JwtService
    ){}

    async addProject(token: string, addProjectDto: AddProjectDto){
        try {
            const data = this.jwtService.verify(token);

          const project =   this.projectRepository.create({
                ...addProjectDto,
                userId: data.sub
            });
            
            await this.projectRepository.save(project);

            return {
                message: 'Project Berhasil Dibuat'
            };
        } catch (error: any) {
            throw new BadRequestException(error.message);   
        }
    }


    async getProject(JWttoken: string){
        try {
            const token = this.jwtService.verify(JWttoken);
            const project = await this.projectRepository.find({ where: { userId: token.sub } });
           return project
        } catch (error) {
            throw new UnauthorizedException('bukan sesi Anda');
        }
    }
}
