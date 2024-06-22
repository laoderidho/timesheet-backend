import { Controller, Post, Get, Headers, Body } from "@nestjs/common";
import { ProjectService } from "./project.service";
import { AddProjectDto } from "./dto/add-project.dto";

@Controller('project')
export class ProjectController{
    constructor(
        private projectService: ProjectService
    ){}

    @Post('add')
    async addProject(@Headers('authorization') token: string, @Body() body: AddProjectDto){
        return this.projectService.addProject(token, body);
    }

    @Get()
    async getProject(@Headers('authorization') token: string){
        return this.projectService.getProject(token);
    }
}