import { Entity, Unique, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Project } from "src/project/entity/project.entity";
import { Jadwal } from "src/jadwal/entity/jadwal.entity";

@Entity('users')
@Unique(['email'])
export class User{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Column()
    password: string;


    @Column()
    rate: number;

    @OneToMany(() => Project, project => project.user)
    projects: Project[];

    @OneToMany(() => Jadwal, jadwal => jadwal.user)
    jadwal: Jadwal[];
}