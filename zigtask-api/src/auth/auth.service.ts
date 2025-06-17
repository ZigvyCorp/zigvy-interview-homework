import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { User, UserDocument } from '../user/user.schema';
import { SignupDto } from './dto/signup.dto';
import { SigninDto } from './dto/signin.dto';
import { ResponseDto } from '../utils/response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async signup(dto: SignupDto): Promise<ResponseDto<any>> {
    const existing = await this.userModel.findOne({ email: dto.email });
    if (existing) {
      throw new ConflictException('Email is already registered');
    }

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      email: dto.email,
      password: hashed,
      fullName: dto.fullName,
    });

    return this.generateToken(user, 'Signup successful');
  }

  async signin(dto: SigninDto): Promise<ResponseDto<any>> {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateToken(user, 'Signin successful');
  }

  private generateToken(user: UserDocument, message: string): ResponseDto<any> {
    const payload = { sub: user._id.toString() };
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException('JWT secret is not configured');
    }

    const token: string = jwt.sign(payload, secret, { expiresIn: '1h' });

    return new ResponseDto(
      {
        accessToken: token,
        user: {
          email: user.email,
          fullName: user.fullName,
        },
      },
      200,
      message,
    );
  }
}
