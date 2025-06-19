import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService
{
    constructor (
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async signup ( signupDto: SignupDto ): Promise<{ token: string }>
    {
        const { email, password } = signupDto;
        const existing = await this.usersService.findByEmail( email );
        if ( existing )
        {
            throw new UnauthorizedException( 'Email already in use' );
        }
        const hash = await bcrypt.hash( password, 10 );
        const user = await this.usersService.create( { email, password: hash } );
        const payload = { sub: user.id, email: user.email };
        return { token: this.jwtService.sign( payload ) };
    }

    async login ( loginDto: LoginDto ): Promise<{ token: string }>
    {
        const { email, password } = loginDto;
        const user = await this.usersService.findByEmail( email );
        if ( !user )
        {
            throw new UnauthorizedException( 'Invalid credentials' );
        }
        const valid = await bcrypt.compare( password, user.password );
        if ( !valid )
        {
            throw new UnauthorizedException( 'Invalid credentials' );
        }
        const payload = { sub: user.id, email: user.email };
        return { token: this.jwtService.sign( payload ) };
    }

    async validateUser ( id: string )
    {
        return this.usersService.findById( id );
    }
}