import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'JWT access token' })
  token: string;

  @ApiProperty({ example: 'User logged in successfully', description: 'Response message' })
  message: string;

  @ApiProperty({
    example: {
      _id: '507f1f77bcf86cd799439011',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active',
      emailVerified: true
    },
    description: 'User information'
  })
  user?: any;
}