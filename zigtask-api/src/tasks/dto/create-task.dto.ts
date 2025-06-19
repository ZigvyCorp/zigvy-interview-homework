import
    {
        IsNotEmpty,
        IsOptional,
        IsEnum,
        IsISO8601,
    } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto
{
    @ApiProperty( { example: 'Buy groceries' } )
    @IsNotEmpty()
    title: string;

    @ApiPropertyOptional( { example: 'Milk, Bread, Eggs' } )
    @IsOptional()
    description?: string;

    @ApiProperty( { example: '2025-07-01T12:00:00Z' } )
    @IsISO8601()
    dueDate: string;

    @ApiPropertyOptional( { enum: TaskStatus, default: TaskStatus.TODO } )
    @IsOptional()
    @IsEnum( TaskStatus )
    status?: TaskStatus;
}
