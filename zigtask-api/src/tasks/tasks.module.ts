import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './tasks.schema';
import { TaskService } from './tasks.service';
import { TaskController } from './tasks.controller';
import { JwtModule } from '../utils/jwt.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    JwtModule,
  ],
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}
