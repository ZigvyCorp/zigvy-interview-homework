import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller( 'users' )
export class UsersController
{
    constructor ( private usersService: UsersService ) { }

    @Get()
    async findAll (): Promise<User[]>
    {
        return this.usersService.findAll();
    }

    @Get( ':id' )
    async findOne ( @Param( 'id' ) id: string ): Promise<User>
    {
        return this.usersService.findById( id );
    }
}