import {
    Column,
    CreateDateColumn,
    Entity, JoinColumn, ManyToOne, OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from 'typeorm';
import {User} from "./user.entity";

@Entity('task')
export class Task {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({unique: true,})
    task_name: string;

    @Column({nullable: true})
    description: string;

    @Column()
    is_important: boolean;

    @Column({nullable: true})
    complete_date: string;

    @Column({nullable: true})
    address: string;

    @ManyToOne(type => User, user => user.task, {onDelete: 'CASCADE'})
    @JoinColumn({name: "user"})
    user: User | string | any;

    @Column({nullable: true})
    created_at: string;

    @UpdateDateColumn()
    updated_at: Date;
}
