import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Task } from '../../tasks/entities/task.entity';

@Entity( 'users' )
export class User
{
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column( { unique: true } )
    email: string;

    @Column()
    password: string;

    @OneToMany( () => Task, ( task ) => task.user, { cascade: true } )
    tasks: Task[];

    @CreateDateColumn()
    createdAt: Date;
}