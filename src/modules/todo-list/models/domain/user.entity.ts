import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {Task} from "./task.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    user_id: string;

    @Column({unique: true,})
    email: string;

    @Column()
    password: string;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({unique: true})
    phone: string;

    @Column({nullable: true})
    address: string;

    @OneToMany(type => Task, task => task.user, {cascade: true})
    @JoinColumn({name: "task"})
    task: Task[];

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
