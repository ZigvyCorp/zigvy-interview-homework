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

    async findAll (
        userId: string,
        filter?: {
            status?: TaskStatus;
            title?: string;
            dateFrom?: string;
            dateTo?: string;
        },
    ): Promise<Task[]>
    {
        const qb = this.tasksRepo
            .createQueryBuilder( 'task' )
            .where( 'task.user.id = :userId', { userId } );

        if ( filter?.status )
        {
            qb.andWhere( 'task.status = :status', { status: filter.status } );
        }
        if ( filter?.title )
        {
            qb.andWhere( 'task.title ILIKE :title', {
                title: `%${ filter.title }%`,
            } );
        }
        if ( filter?.dateFrom )
        {
            qb.andWhere( 'task.dueDate >= :dateFrom', {
                dateFrom: filter.dateFrom,
            } );
        }
        if ( filter?.dateTo )
        {
            qb.andWhere( 'task.dueDate <= :dateTo', {
                dateTo: filter.dateTo,
            } );
        }

        return qb.getMany();
    }

    async findOne ( userId: string, id: string ): Promise<Task>
    {
        const task = await this.tasksRepo.findOne( {
            where: { id, user: { id: userId } },
        } );
        if ( !task ) throw new NotFoundException( 'Task not found' );
        return task;
    }
    async findGrouped (
        userId: string,
        filter?: { status?: TaskStatus; title?: string; dateFrom?: string; dateTo?: string; },
    ): Promise<Record<TaskStatus, Task[]>>
    {
        const tasks = await this.findAll( userId, filter );
        // Khởi tạo map với các status mặc định
        const grouped: Record<TaskStatus, Task[]> = {
            [ TaskStatus.TODO ]: [],
            [ TaskStatus.IN_PROGRESS ]: [],
            [ TaskStatus.DONE ]: [],
        };
        for ( const task of tasks )
        {
            grouped[ task.status ].push( task );
        }
        return grouped;
    }

    async update (
        id: string,
        userId: string,
        dto: UpdateTaskDto,
    ): Promise<Task>
    {
        const task = await this.findOne( userId, id );
        Object.assign( task, dto );
        if ( dto.dueDate )
        {
            task.dueDate = new Date( dto.dueDate );
        }
        return this.tasksRepo.save( task );
    }

    async remove ( id: string, userId: string ): Promise<void>
    {
        const res = await this.tasksRepo.delete( {
            id,
            user: { id: userId } as any,
        } );
        if ( res.affected === 0 ) throw new NotFoundException( 'Task not found' );
    }
}
