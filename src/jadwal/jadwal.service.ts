import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Jadwal } from "./entity/jadwal.entity";
import { JwtService } from "@nestjs/jwt";
import { JadwalDto } from "./dto/jadwal.dto";
import { User } from "src/auth/entities/user.entity";

@Injectable()
export class JadwalService {
    constructor(
        @InjectRepository(Jadwal)
        private jadwalRepository: Repository<Jadwal>,
        private jwtServices: JwtService,
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async addJadwal(token: string, jadwal: JadwalDto ){
        try {
            const authToken = this.jwtServices.verify(token);

            const jam_mulai = this.ParseTime(jadwal.jam_mulai);
            const jam_selesai = this.ParseTime(jadwal.jam_selesai);


            const getTime = (jam_selesai.getTime() - jam_mulai.getTime())/(1000 * 60);
            const jam = Math.floor(getTime / 60);
            const menit = getTime % 60;

            const durasi = `${jam}:${menit}`;

            const newJadwal = this.jadwalRepository.create({
                ...jadwal,
                durasi: durasi,
                userId: authToken.sub
            });

            await this.jadwalRepository.save(newJadwal);

            return {
                message: 'Jadwal berhasil ditambahkan'
            }
        } catch (error) {
            throw error
        }
    }

    private ParseTime(time: string): Date {
        const [hour, minute] = time.split(':').map(Number);
        const date = new Date();

        date.setHours(hour, minute, 0, 0);
        return date
    }

    async getTotalPendapatan(token: string){
        try {
            const authToken = this.jwtServices.verify(token);
            const user = await this.userRepository.findOne({where: {id: authToken.sub}});
            
            const jadwal = await this.jadwalRepository.find({where: {userId: user.id}});
            

            let getTotalPendapatan = 0;
            let getTotalLembur =0;
            for(let i=0; i<jadwal.length; i++){
                const durasi = jadwal[i].durasi
                const getHoursString = durasi.toString().split(':')[0]
                const jam = parseInt(getHoursString)
                const getMinutesString = durasi.toString().split(':')[1]
                const menit = parseInt(getMinutesString)

                // jam mulai 
                const jam_mulai = jadwal[i].jam_mulai
                const getHoursStringJamMulai = jam_mulai.toString().split(':')[0]
                const jamMulai = parseInt(getHoursStringJamMulai)
                const jam_selesai = jadwal[i].jam_selesai
                const getHoursStringJamSelesai = jam_selesai.toString().split(':')[0]
                const jamSelesai = parseInt(getHoursStringJamSelesai)

                // jika tanggalnya sama / 1 hari
                if(jadwal[i].tanggal_mulai === jadwal[i].tanggal_selesai){
                    if((jam >= 8 && menit > 0) && (jamMulai <= 9 && jamSelesai >= 17)){
                        getTotalPendapatan += (8 * user.rate) + (0 * user.rate / 60)
                        getTotalLembur += (((jam - 8) * user.rate) + (menit * user.rate / 60)) * 1.3
                    }else{
                        const min = Math.min(jamSelesai, 17)
                        const max = Math.max(jamMulai, 9)

                        const total = min - max;
                        getTotalPendapatan += (total * user.rate) + (menit * user.rate / 60)
                    }     
                }

                else{ // jika lebih dari 1 hari
                    const tanggal_mulai: any = new Date(jadwal[i].tanggal_mulai)
                    const tanggal_selesai: any = new Date(jadwal[i].tanggal_selesai)
                    const hitungTanggal = Math.abs(tanggal_selesai - tanggal_mulai)

                    const hitungHari = Math.ceil(hitungTanggal / (1000 * 60 * 60 * 24))

                    if((jam >= 8 && menit > 0) && (jamMulai <= 9 && jamSelesai >= 17)){
                        getTotalPendapatan += ((8 * user.rate) + (0 * user.rate / 60)) * (hitungHari + 1)
                        getTotalLembur += ((((jam - 8) * user.rate) + (menit * user.rate / 60)) * 1.3) * (hitungHari + 1)
                    }else{
                        const min = Math.min(jamSelesai, 17)
                        const max = Math.max(jamMulai, 9)

                        const total = min - max;
                        getTotalPendapatan += ((total * user.rate) + (menit * user.rate / 60)) * (hitungHari + 1)
                    }
                }
            }
            return {
                totalPendapatan: getTotalPendapatan,
                totalLembur: getTotalLembur
            }

        } catch (error) {
            throw error
        }
    }

    async getTotalDurasi(token: string){
        try {
            const authToken = this.jwtServices.verify(token);
            const user = await this.userRepository.findOne({where: {id: authToken.sub}});
            
            const jadwal = await this.jadwalRepository.find({where: {userId: user.id}});
            
            let getTotalDurasi = 0;
            for(let i=0; i<jadwal.length; i++){

                const durasi = jadwal[i].durasi
                const getHoursString = durasi.toString().split(':')[0]
                const jam = parseInt(getHoursString)
                const getMinutesString = durasi.toString().split(':')[1]
                const menit = parseInt(getMinutesString)

                if(jadwal[i].tanggal_mulai === jadwal[i].tanggal_selesai){
                    getTotalDurasi += (jam * 60) + menit
                }else{
                    const tanggal_mulai: any = new Date(jadwal[i].tanggal_mulai)
                    const tanggal_selesai: any = new Date(jadwal[i].tanggal_selesai)
                    const hitungTanggal = Math.abs(tanggal_selesai - tanggal_mulai) 
                    const hitungHari = Math.ceil(hitungTanggal / (1000 * 60 * 60 * 24))
                    getTotalDurasi += ((jam * 60) + menit) * (hitungHari + 1)
                }
            }

            const totalDurasi = `${Math.floor(getTotalDurasi / 60)} jam ${getTotalDurasi % 60} menit`

            return {
                totalDurasi: totalDurasi
            }

        } catch (error) {
            throw error
        }
    }

    async updateJadwal(token: string, jadwal: JadwalDto, id: number){
        try {
            const authToken = this.jwtServices.verify(token);

            const jam_mulai = this.ParseTime(jadwal.jam_mulai);
            const jam_selesai = this.ParseTime(jadwal.jam_selesai);

            const getTime = (jam_selesai.getTime() - jam_mulai.getTime())/(1000 * 60);
            const jam = Math.floor(getTime / 60);
            const menit = getTime % 60;

            const durasi = `${jam}:${menit}`;

            const data = this.jadwalRepository.findOne({where: {id: id}});

            if(authToken.sub !== (await data).userId){
                throw new UnauthorizedException('Anda tidak memiliki akses untuk mengupdate jadwal ini')
            }

            await this.jadwalRepository.update({id: id}, {
                ...jadwal,
                durasi: durasi,
                userId: authToken.sub
            });

            return {
                message: 'Jadwal berhasil diupdate'
            }
        } catch (error) {
            throw error
        }
    }

    async deleteJadwal(token: string, id: number){
        try {
            const authToken = this.jwtServices.verify(token);

            const data = this.jadwalRepository.findOne({where: {id: id}});

            if(authToken.sub !== (await data).userId){
                throw new UnauthorizedException('Anda tidak memiliki akses untuk menghapus jadwal ini')
            }

            await this.jadwalRepository.delete({id: id});

            return {
                message: 'Jadwal berhasil dihapus'
            }
        } catch (error : any) {
            throw error
        }
    }
}