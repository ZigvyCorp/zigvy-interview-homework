import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument, TaskStatus } from './tasks.schema';
import { Model, FilterQuery } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async createTask(data: CreateTaskDto): Promise<Task> {
    return this.taskModel.create(data);
  }

  async updateTask(id: string, updates: UpdateTaskDto): Promise<Task> {
    const task = await this.taskModel.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.taskModel.findByIdAndDelete(id);
    if (!result) throw new NotFoundException('Task not found');
  }

  async getTasksGrouped(): Promise<Record<TaskStatus, Task[]>> {
    const tasks = await this.taskModel.find().exec();
    return {
      [TaskStatus.TODO]: tasks.filter((t) => t.status === TaskStatus.TODO),
      [TaskStatus.IN_PROGRESS]: tasks.filter(
        (t) => t.status === TaskStatus.IN_PROGRESS,
      ),
      [TaskStatus.DONE]: tasks.filter((t) => t.status === TaskStatus.DONE),
    };
  }

  async toggleStatus(id: string, newStatus: TaskStatus): Promise<Task> {
    if (!Object.values(TaskStatus).includes(newStatus)) {
      throw new BadRequestException('Invalid task status');
    }
    return this.updateTask(id, { status: newStatus });
  }

  async searchAndFilter(query: FilterTaskDto): Promise<Task[]> {
    const filter: FilterQuery<TaskDocument> = {};

    if (query.from && query.to) {
      const fromDate = new Date(query.from);
      const toDate = new Date(query.to);
      if (fromDate > toDate) {
        throw new BadRequestException('"from" date cannot be after "to" date');
      }
    }

    if (query.title) {
      filter.title = { $regex: query.title, $options: 'i' };
    }

    if (query.from || query.to) {
      filter.dueDate = {} as { $gte?: Date; $lte?: Date };
      if (query.from)
        (filter.dueDate as { $gte?: Date }).$gte = new Date(query.from);
      if (query.to)
        (filter.dueDate as { $lte?: Date }).$lte = new Date(query.to);
    }

    return this.taskModel.find(filter).exec();
  }
}
