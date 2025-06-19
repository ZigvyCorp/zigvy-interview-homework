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
    @ApiOperation( { summary: 'Get tasks grouped by status' } )
    @ApiResponse( { status: 200, description: 'Tasks grouped by status', type: Object } )
    grouped (
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
