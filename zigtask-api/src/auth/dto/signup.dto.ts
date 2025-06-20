import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignupDto
{
    @IsEmail()
    email: string;

    @IsString()
    @MinLength( 6 )
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    fullName: string;
}