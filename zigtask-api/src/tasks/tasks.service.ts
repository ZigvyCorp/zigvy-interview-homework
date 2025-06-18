import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';

import { Task, TaskDocument, TaskStatus } from './tasks.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { JwtService } from '../utils/jwt.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private jwtService: JwtService,
  ) {}

  private getUserId(token: string): string {
    const payload = this.jwtService.verifyToken(token);
    if (!payload?.sub) {
      throw new UnauthorizedException('User ID is required');
    }
    return payload.sub;
  }

  async createTask(data: CreateTaskDto, accessToken: string): Promise<Task> {
    const userId = this.getUserId(accessToken);
    return this.taskModel.create({ ...data, ownerId: userId });
  }

  async updateTask(
    id: string,
    updates: UpdateTaskDto,
    accessToken: string,
  ): Promise<Task> {
    const userId = this.getUserId(accessToken);
    const task = await this.taskModel.findOneAndUpdate(
      { _id: id, ownerId: userId },
      updates,
      { new: true },
    );
    if (!task) throw new NotFoundException('Task not found or not yours');
    return task;
  }

  async deleteTask(id: string, accessToken: string): Promise<void> {
    const userId = this.getUserId(accessToken);
    const result = await this.taskModel.findOneAndDelete({
      _id: id,
      ownerId: userId,
    });
    if (!result) throw new NotFoundException('Task not found or not yours');
  }

  async getTasksGrouped(
    accessToken: string,
  ): Promise<Record<TaskStatus, Task[]>> {
    const userId = this.getUserId(accessToken);
    const tasks = await this.taskModel.find({ ownerId: userId }).exec();
    return {
      [TaskStatus.TODO]: tasks.filter((t) => t.status === TaskStatus.TODO),
      [TaskStatus.IN_PROGRESS]: tasks.filter(
        (t) => t.status === TaskStatus.IN_PROGRESS,
      ),
      [TaskStatus.DONE]: tasks.filter((t) => t.status === TaskStatus.DONE),
    };
  }

  async toggleStatus(
    id: string,
    newStatus: TaskStatus,
    accessToken: string,
  ): Promise<Task> {
    if (!Object.values(TaskStatus).includes(newStatus)) {
      throw new BadRequestException('Invalid task status');
    }
    return this.updateTask(id, { status: newStatus }, accessToken);
  }

  async searchAndFilter(
    query: FilterTaskDto,
    accessToken: string,
  ): Promise<Task[]> {
    const userId = this.getUserId(accessToken);
    const filter: FilterQuery<TaskDocument> = { ownerId: userId };

    if (query.title) {
      filter.title = { $regex: query.title, $options: 'i' };
    }

    if (query.from || query.to) {
      const fromDate = query.from ? new Date(query.from) : undefined;
      const toDate = query.to ? new Date(query.to) : undefined;

      if (fromDate && toDate && fromDate > toDate) {
        throw new BadRequestException('"from" date cannot be after "to" date');
      }

      filter.dueDate = {};
      if (query.from || query.to) {
        filter.dueDate = {} as { $gte?: Date; $lte?: Date };
        if (query.from)
          (filter.dueDate as { $gte?: Date }).$gte = new Date(query.from);
        if (query.to)
          (filter.dueDate as { $lte?: Date }).$lte = new Date(query.to);
      }
    }

    return this.taskModel.find(filter).exec();
  }
}
