import
{
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseGuards,
    Request,
    Query,
    ParseUUIDPipe,
} from '@nestjs/common';
import
{
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskStatus, Task } from './entities/task.entity';

@ApiTags( 'tasks' )
@UseGuards( JwtAuthGuard )
@Controller( 'tasks' )
export class TasksController
{
    constructor ( private tasksService: TasksService ) { }

    @Post()
    @ApiOperation( { summary: 'Create a new task' } )
    @ApiResponse( { status: 201, description: 'Task created', type: Task } )
    create ( @Request() req, @Body() dto: CreateTaskDto )
    {
        return this.tasksService.create( req.user.userId, dto );
    }

    @Get()
    @ApiOperation( { summary: 'Get tasks with optional filters' } )
    @ApiResponse( { status: 200, description: 'Tasks retrieved', type: [ Task ] } )
    @ApiResponse( { status: 401, description: 'Unauthorized' } )
    @ApiQuery( { name: 'status', required: false, enum: TaskStatus, description: 'Filter by task status' } )
    @ApiQuery( { name: 'title', required: false, description: 'Search by title (case-insensitive)' } )
    @ApiQuery( { name: 'from', required: false, description: 'Filter by due date from (YYYY-MM-DD)' } )
    @ApiQuery( { name: 'to', required: false, description: 'Filter by due date to (YYYY-MM-DD)' } )
    findAll (
        @Request() req,
        @Query( 'status' ) status?: TaskStatus,
        @Query( 'title' ) title?: string,
        @Query( 'from' ) dateFrom?: string,
        @Query( 'to' ) dateTo?: string,
    )
    {
        return this.tasksService.findAll( req.user.userId, {
            status,
            title,
            dateFrom,
            dateTo,
        } );
    }

    @Get( ':id' )
    @ApiOperation( { summary: 'Get a task by ID' } )
    @ApiResponse( { status: 200, description: 'Task retrieved', type: Task } )
    findOne (
        @Request() req,
        @Param( 'id', new ParseUUIDPipe() ) id: string,
    )
    {
        return this.tasksService.findOne( req.user.userId, id );
    }
    @Get( 'grouped' )
    @ApiOperation( {
        summary: 'Get tasks grouped by status',
        description: 'Retrieve all tasks for the authenticated user grouped by their status (TODO, IN_PROGRESS, DONE)'
    } )
    @ApiQuery( {
        name: 'title',
        required: false,
        description: 'Filter tasks by title (case-insensitive contains)',
        example: 'meeting'
    } )
    @ApiQuery( {
        name: 'from',
        required: false,
        description: 'Filter tasks with due date on or after this date (YYYY-MM-DD)',
        example: '2023-01-01'
    } )
    @ApiQuery( {
        name: 'to',
        required: false,
        description: 'Filter tasks with due date on or before this date (YYYY-MM-DD)',
        example: '2023-12-31'
    } )
    @ApiResponse( {
        status: 200,
        description: 'Tasks grouped by status',
        schema: {
            type: 'object',
            example: {
                'TODO': [ 
                    { 
                        id: '550e8400-e29b-41d4-a716-446655440000',
                        title: 'Task 1',
                        description: 'Task description',
                        status: 'TODO',
                        dueDate: '2023-12-31',
                        userId: 'user-id-123',
                        createdAt: '2023-01-01T00:00:00.000Z',
                        updatedAt: '2023-01-01T00:00:00.000Z'
                    }
                ],
                'IN_PROGRESS': [],
                'DONE': []
            }
        }
    } )
    @ApiResponse( { status: 400, description: 'Invalid date format' } )
    @ApiResponse( { status: 401, description: 'Unauthorized' } )
    @ApiResponse( { status: 500, description: 'Internal server error' } )
    async grouped (
        @Request() req,
        @Query( 'title' ) title?: string,
        @Query( 'from' ) dateFrom?: string,
        @Query( 'to' ) dateTo?: string,
    )
    {
        return this.tasksService.findGrouped( req.user.userId, {
            title,
            dateFrom,
            dateTo,
        } );
    }

    @Put( ':id' )
    @ApiOperation( { summary: 'Update a task' } )
    @ApiResponse( { status: 200, description: 'Task updated', type: Task } )
    update (
        @Param( 'id', new ParseUUIDPipe() ) id: string,
        @Request() req,
        @Body() dto: UpdateTaskDto,
    )
    {
        return this.tasksService.update( id, req.user.userId, dto );
    }

    @Delete( ':id' )
    @ApiOperation( { summary: 'Delete a task' } )
    @ApiResponse( { status: 200, description: 'Task deleted' } )
    remove (
        @Param( 'id', new ParseUUIDPipe() ) id: string,
        @Request() req,
    )
    {
        return this.tasksService.remove( id, req.user.userId );
    }
}
