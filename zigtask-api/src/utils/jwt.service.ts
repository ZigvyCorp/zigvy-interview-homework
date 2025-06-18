import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService) {}

  verifyToken(token: string): any {
    try {
      const cleanToken = token.replace('Bearer ', '');

      const secret = this.configService.get<string>('JWT_SECRET');
      if (!secret) {
        throw new UnauthorizedException('JWT secret not configured');
      }

      return jwt.verify(cleanToken, secret);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
