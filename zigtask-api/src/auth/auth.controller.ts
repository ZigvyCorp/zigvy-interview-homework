import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController
{
    constructor(private authService: AuthService) {}

    @Post('signup')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiResponse({ status: 201, description: 'User created successfully' })
    signup(@Body() signupDto: SignupDto)
    {
        return this.authService.signup(signupDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Authenticate user and get JWT token' })
    @ApiResponse({ status: 200, description: 'Authentication successful' })
    login(@Body() loginDto: LoginDto)
    {
        return this.authService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({ status: 200, description: 'User profile retrieved' })
    getProfile(@Request() req)
    {
        return req.user;
    }
}