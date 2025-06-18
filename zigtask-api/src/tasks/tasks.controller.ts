import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Headers,
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
  ApiHeader,
} from '@nestjs/swagger';

@ApiTags('Tasks')
@ApiHeader({ name: 'Authorization', required: true })
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  create(
    @Body() body: CreateTaskDto,
    @Headers('authorization') accessToken: string,
  ) {
    return this.taskService.createTask(body, accessToken);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  update(
    @Param('id') id: string,
    @Body() body: UpdateTaskDto,
    @Headers('authorization') accessToken: string,
  ) {
    return this.taskService.updateTask(id, body, accessToken);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  remove(
    @Param('id') id: string,
    @Headers('authorization') accessToken: string,
  ) {
    return this.taskService.deleteTask(id, accessToken);
  }

  @Get('grouped')
  @ApiOperation({ summary: 'Get tasks grouped by status' })
  getGrouped(@Headers('authorization') accessToken: string) {
    return this.taskService.getTasksGrouped(accessToken);
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
  toggleStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
    @Headers('authorization') accessToken: string,
  ) {
    return this.taskService.toggleStatus(id, status, accessToken);
  }

  @Get()
  @ApiOperation({ summary: 'Search and filter tasks by title and date range' })
  @ApiQuery({ name: 'title', required: false })
  @ApiQuery({ name: 'from', required: false })
  @ApiQuery({ name: 'to', required: false })
  search(
    @Query() query: FilterTaskDto,
    @Headers('authorization') accessToken: string,
  ) {
    return this.taskService.searchAndFilter(query, accessToken);
  }
}
