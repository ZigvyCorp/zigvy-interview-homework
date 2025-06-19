import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TaskStatus
{
    TODO = 'To Do',
    IN_PROGRESS = 'In Progress',
    DONE = 'Done',
}

@Entity( 'tasks' )
export class Task
{
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column()
    title: string;

    @Column( { nullable: true } )
    description: string;

    @Column( { type: 'timestamp' } )
    dueDate: Date;

    @Column( { type: 'enum', enum: TaskStatus, default: TaskStatus.TODO } )
    status: TaskStatus;

    @ManyToOne( () => User, ( user: User ) => user.tasks, { onDelete: 'CASCADE' } )
    user: User;

    @CreateDateColumn()
    createdAt: Date;
}
