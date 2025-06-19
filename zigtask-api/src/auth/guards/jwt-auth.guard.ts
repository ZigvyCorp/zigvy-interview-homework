import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard( 'jwt' ) {
    canActivate ( context: ExecutionContext )
    {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers?.authorization;

        if ( !authHeader || !authHeader.startsWith( 'Bearer ' ) )
        {
            throw new UnauthorizedException( 'No token provided' );
        }

        return super.canActivate( context );
    }

    handleRequest ( err: any, user: any, info: any )
    {
        if ( err || !user )
        {
            const errorMessage = info?.message || 'Unknown error';
            throw err || new UnauthorizedException( 'Invalid or expired token' );
        }

        return user;
    }
}