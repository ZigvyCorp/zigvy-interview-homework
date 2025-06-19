import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService
{
    constructor (
        @InjectRepository( User )
        private usersRepo: Repository<User>,
    ) { }

    async create ( data: CreateUserDto ): Promise<User>
    {
        const user = this.usersRepo.create( data );
        return this.usersRepo.save( user );
    }

    async findByEmail ( email: string ): Promise<User | null>
    {
        return await this.usersRepo.findOne( { where: { email } } );
    }

    async findById ( id: string ): Promise<User>
    {
        const user = await this.usersRepo.findOne( { where: { id } } );
        if ( !user ) throw new NotFoundException( 'User not found' );
        return user;
    }

    async findAll (): Promise<User[]>
    {
        return this.usersRepo.find();
    }
}