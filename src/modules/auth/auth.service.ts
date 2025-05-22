import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

import { User, UserDocument } from './schemas/user.schema';
import { UserRole, UserStatus } from '../../common/enums/user-role';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import {
  PasswordReset,
  PasswordResetDocument,
} from './schemas/password-reset.schema';
import { VerifyCodeDto } from './dto/verify-code.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EmailService } from '../../common/services/email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(PasswordReset.name)
    private passwordResetModel: Model<PasswordResetDocument>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  // Create Regular User
  async signup(
    signUpDto: SignUpDto,
  ): Promise<{ token: string; message: string; user: any }> {
    const { name, email, password } = signUpDto;

    // Check if a user exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role: UserRole.USER,
      status: UserStatus.ACTIVE,
      emailVerified: false,
      permissions: {}, // Regular users have no special permissions
    });

    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      role: user.role,
    });

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      emailVerified: user.emailVerified,
    };

    return {
      token,
      message: 'User registered successfully',
      user: userResponse,
    };
  }

  // Log User In
  async signIn(
    dto: SignInDto,
  ): Promise<{ token: string; message: string; user: any }> {
    if (!dto.password || !dto.email) {
      throw new BadRequestException('Email and password must be provided');
    }

    const user = await this.userModel
      .findOne({ email: dto.email })
      .select('+password');

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user account is inactive
    if (user.status === UserStatus.INACTIVE) {
      throw new UnauthorizedException(
        'Your account is inactive. Please contact an administrator.',
      );
    }

    const valid = await bcrypt.compare(dto.password, user.password);
    if (!valid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user._id) {
      throw new UnauthorizedException('Invalid user ID');
    }

    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return user without a password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      permissions: user.permissions,
      emailVerified: user.emailVerified,
    };

    return { token, message: 'Logged in successfully', user: userResponse };
  }

  // Send password reset code
  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = dto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Generate a random 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash the code before storing it
    const hashedCode = await bcrypt.hash(code, 10);

    // Save the reset code to the database
    await this.passwordResetModel.deleteMany({ user: user._id }); // Delete any existing codes
    await this.passwordResetModel.create({
      user: user._id,
      code: hashedCode,
      used: false,
    });

    // Send the code via email
    await this.emailService.sendPasswordResetCode(email, code);

    return { message: 'Password reset code sent to your email' };
  }

  // Verify reset code and provide token
  async verifyCode(
    dto: VerifyCodeDto,
  ): Promise<{ token: string; message: string }> {
    const { email, code } = dto;

    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Find the most recent reset entry for this user
    const resetEntry = await this.passwordResetModel
      .findOne({
        user: user._id,
        used: false,
      })
      .sort({ createdAt: -1 }); // Get the most recent one

    if (!resetEntry) {
      throw new BadRequestException(
        'No valid reset code found. Please request a new code.',
      );
    }

    // Verify the code
    const codeValid = await bcrypt.compare(code, resetEntry.code);
    if (!codeValid) {
      throw new BadRequestException('Invalid reset code');
    }

    // Check if code has expired (1-hour validity)
    const now = new Date();
    const expiryTime = new Date(resetEntry.createdAt.getTime() + 3600000);

    if (now > expiryTime) {
      resetEntry.used = true;
      await resetEntry.save();
      throw new BadRequestException(
        'Reset code has expired. Please request a new code.',
      );
    }

    // Mark code as used
    resetEntry.used = true;
    await resetEntry.save();

    // Generate reset token with 15 min validity
    const resetToken = this.jwtService.sign(
      {
        sub: user._id,
        email: user.email,
        purpose: 'password-reset',
      },
      { expiresIn: '15m' },
    );

    return { token: resetToken, message: 'Code verified successfully' };
  }

  // Reset password using token

  async resetPassword(
    userId: string,
    dto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { password, confirmPassword } = dto;

    if (password !== confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    // Ensure a proper ID format and handle potential invalid ObjectId
    try {
      const user = await this.userModel.findById(userId).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Use the found user document to update
      user.password = await bcrypt.hash(password, 10);
      await user.save();

      // Clean up used reset codes
      await this.passwordResetModel.deleteMany({ user: user._id });

      return { message: 'Password reset successfully' };
    } catch (error) {
      if (error.name === 'CastError') {
        throw new BadRequestException('Invalid user ID format');
      }
      throw error;
    }
  }

  private signToken(userId: string, email: string, role: UserRole): string {
    return this.jwtService.sign({ 
      sub: userId, 
      email, 
      role,
      status: UserStatus.ACTIVE // Include status as well
    });
  }
}