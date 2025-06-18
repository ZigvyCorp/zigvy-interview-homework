import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus } from '../tasks.schema';

export class CreateTaskDto {
  @ApiProperty({
    example: 'Finish report',
    description: 'The title of the task',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({
    example: 'Complete the sales report for Q2',
    description: 'An optional description of the task',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: '2025-06-30T23:59:59Z',
    description: 'The due date of the task in ISO format',
  })
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional({
    example: TaskStatus.TODO,
    description: 'The status of the task',
    enum: TaskStatus,
  })
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;
}
