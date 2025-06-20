import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty()
  user: User;

  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
