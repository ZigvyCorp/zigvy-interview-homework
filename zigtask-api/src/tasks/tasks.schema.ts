// task.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
}

@Schema({ timestamps: true })
export class Task {
  @ApiProperty({ description: 'Task title', example: 'Finish report' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({
    description: 'Task description',
    example: 'Complete the sales report for Q2',
  })
  @Prop()
  description: string;

  @ApiProperty({
    description: 'Task due date',
    example: '2025-06-30T23:59:59Z',
  })
  @Prop({ required: true })
  dueDate: Date;

  @ApiProperty({
    description: 'Task status',
    enum: TaskStatus,
    default: TaskStatus.TODO,
  })
  @Prop({ enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
