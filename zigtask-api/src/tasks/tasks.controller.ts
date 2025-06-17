import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { TaskStatus } from './tasks.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  create(@Body() body: CreateTaskDto) {
    return this.taskService.createTask(body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  update(@Param('id') id: string, @Body() body: UpdateTaskDto) {
    return this.taskService.updateTask(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  remove(@Param('id') id: string) {
    return this.taskService.deleteTask(id);
  }

  @Get('grouped')
  @ApiOperation({ summary: 'Get tasks grouped by status' })
  getGrouped() {
    return this.taskService.getTasksGrouped();
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update status of a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: {
          type: 'string',
          enum: Object.values(TaskStatus),
        },
      },
    },
  })
  toggleStatus(@Param('id') id: string, @Body('status') status: TaskStatus) {
    return this.taskService.toggleStatus(id, status);
  }

  @Get()
  @ApiOperation({ summary: 'Search and filter tasks by title and date range' })
  @ApiQuery({
    name: 'title',
    required: false,
    description: 'Title of the task',
  })
  @ApiQuery({
    name: 'from',
    required: false,
    description: 'Start date (ISO format)',
  })
  @ApiQuery({
    name: 'to',
    required: false,
    description: 'End date (ISO format)',
  })
  search(@Query() query: FilterTaskDto) {
    return this.taskService.searchAndFilter(query);
  }
}
