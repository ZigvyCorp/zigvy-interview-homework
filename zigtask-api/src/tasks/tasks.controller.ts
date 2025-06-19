import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards, Request, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TaskStatus } from './entities/task.entity';

@UseGuards( JwtAuthGuard )
@Controller( 'tasks' )
export class TasksController
{
    constructor ( private tasksService: TasksService ) { }

    @Post()
    create ( @Request() req, @Body() dto: CreateTaskDto )
    {
        return this.tasksService.create( req.user.userId, dto );
    }

    @Get()
    findAll ( @Request() req )
    {
        return this.tasksService.findAll( req.user.userId );
    }

    @Get( 'status' )
    findByStatus (
        @Request() req,
        @Query( 'status' ) status: TaskStatus,
    )
    {
        return this.tasksService.findByStatus( req.user.userId, status );
    }

    @Put( ':id' )
    update (
        @Param( 'id' ) id: string,
        @Request() req,
        @Body() dto: UpdateTaskDto,
    )
    {
        return this.tasksService.update( id, req.user.userId, dto );
    }

    @Delete( ':id' )
    remove (
        @Param( 'id' ) id: string,
        @Request() req,
    )
    {
        return this.tasksService.remove( id, req.user.userId );
    }
}