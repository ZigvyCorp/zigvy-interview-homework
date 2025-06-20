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

    async login ( loginDto: LoginDto ): Promise<{ user: any; accessToken: string; refreshToken: string }>
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
        
        const accessToken = this.jwtService.sign( payload );
        const refreshToken = this.jwtService.sign( payload, { expiresIn: '7d' } ); // Example: Refresh token expires in 7 days

        // Remove password before returning user object
        const { password: _, ...userWithoutPassword } = user;

        return {
            user: userWithoutPassword,
            accessToken,
            refreshToken,
        };
    }

    async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
        try {
            // Giải mã refreshToken, xác thực hợp lệ
            const payload = this.jwtService.verify(refreshToken);
            // Có thể kiểm tra thêm trong DB nếu muốn revoke refresh token
            const accessToken = this.jwtService.sign({ sub: payload.sub, email: payload.email });
            return { accessToken };
        } catch (error) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async validateUser ( id: string )
    {
        return this.usersService.findById( id );
    }
}