import { IsNotEmpty, IsOptional, IsEnum, IsISO8601 } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto
{
    @IsNotEmpty()
    title: string;

    @IsOptional()
    description?: string;

    @IsISO8601()
    dueDate: string; // ISO date string

    @IsOptional()
    @IsEnum( TaskStatus )
    status?: TaskStatus;
}