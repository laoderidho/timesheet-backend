import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Project } from "src/project/entity/project.entity";
import { User } from "src/auth/entities/user.entity";

@Entity('jadwal')
export class Jadwal {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string

    @Column()
    projectId : number

    @Column()
    userId: number

    @Column({ type: 'date' })
    tanggal_mulai: Date

    @Column({ type: 'date' })
    tanggal_selesai: Date

    @Column({ type: 'time' })
    jam_mulai: Date

    @Column({ type: 'time' })
    jam_selesai: Date

    @Column({type: 'time'})
    durasi: Date

    @ManyToOne(() => Project, project => project.jadwal)
    project: Project;

    @ManyToOne(() => User, user => user.jadwal)
    user: User;
}