import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService
{
    constructor (
        @InjectRepository( Task )
        private tasksRepo: Repository<Task>,
    ) { }

    async create ( userId: string, dto: CreateTaskDto ): Promise<Task>
    {
        const task = this.tasksRepo.create( {
            ...dto,
            dueDate: new Date( dto.dueDate ),
            status: dto.status || TaskStatus.TODO,
            user: { id: userId } as any,
        } );
        return this.tasksRepo.save( task );
    }

    async findAll ( userId: string ): Promise<Task[]>
    {
        return this.tasksRepo.find( { where: { user: { id: userId } } } );
    }

    async findByStatus ( userId: string, status: TaskStatus ): Promise<Task[]>
    {
        return this.tasksRepo.find( { where: { user: { id: userId }, status } } );
    }

    async update ( id: string, userId: string, dto: UpdateTaskDto ): Promise<Task>
    {
        const task = await this.tasksRepo.findOne( { where: { id, user: { id: userId } } } );
        if ( !task ) throw new NotFoundException( 'Task not found' );
        Object.assign( task, dto );
        if ( dto.dueDate ) task.dueDate = new Date( dto.dueDate );
        return this.tasksRepo.save( task );
    }

    async remove ( id: string, userId: string ): Promise<void>
    {
        const res = await this.tasksRepo.delete( { id, user: { id: userId } } );
        if ( res.affected === 0 ) throw new NotFoundException( 'Task not found' );
    }
}