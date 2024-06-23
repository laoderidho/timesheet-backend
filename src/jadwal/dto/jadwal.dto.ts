import { IsNumber, IsString, Matches } from "class-validator";

export class JadwalDto {
    @IsString()
    title: string;

    @IsNumber()
    projectId: number;

    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    tanggal_mulai: string;

    @IsString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/)
    tanggal_selesai: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/)
    jam_mulai: string;

    @IsString()
    @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/)
    jam_selesai: string;

}