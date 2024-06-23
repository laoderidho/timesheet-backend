import { Controller, Post, Get, Headers, Body, Put, Param, Delete } from "@nestjs/common";
import { JadwalService } from "./jadwal.service";
import { JadwalDto } from "./dto/jadwal.dto";

@Controller('jadwal')
export class JadwalController{
    constructor(
        private jadwalService: JadwalService,
    ){}

    @Post('add')
    async addJadwal(@Headers ('authorization') token: string, @Body() jadwal: JadwalDto){
        return this.jadwalService.addJadwal(token, jadwal)
    }

    @Get('pendapatan')
    async getTotalPendapatan(@Headers ('authorization') token: string){
        return this.jadwalService.getTotalPendapatan(token)
    }

    @Get('total-durasi')
    async getTotalDurasi(@Headers ('authorization') token: string){
        return this.jadwalService.getTotalDurasi(token)
    }

    @Put('update/:id')
    async updateJadwal(@Headers ('authorization') token: string, @Body() jadwal: JadwalDto, @Param('id') id: number){
        return this.jadwalService.updateJadwal(token, jadwal, id)
    }

    @Delete('delete/:id')
    async deleteJadwal(@Headers ('authorization') token: string, @Param('id') id: number){
        return this.jadwalService.deleteJadwal(token, id)
    }
}