import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany  } from "typeorm";
import { User } from "src/auth/entities/user.entity";
import { Jadwal } from "src/jadwal/entity/jadwal.entity";

@Entity('projects')
export class Project{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    userId: number;

    @ManyToOne(() => User, user => user.projects)
    user: User;

    @OneToMany(() => Jadwal, jadwal => jadwal.project)
    jadwal: Jadwal[];
}