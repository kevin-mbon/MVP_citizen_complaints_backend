import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { Model } from 'mongoose';
import { PasswordGeneratorService } from 'src/common/services/password-generator.service';
import { EmailService } from 'src/common/services/email.service';
import { CreateAdminDto } from '../auth/dto/create-admin.dto';
import { UserRole, UserStatus } from '../../common/enums/user-role';
import * as bcrypt from 'bcryptjs';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private passwordGeneratorService: PasswordGeneratorService,
    private emailService: EmailService,
  ) {}

  /**
   * Create a new admin user with a randomly generated password
   */
  async createAdmin(createAdminDto: CreateAdminDto, creatorId: string): Promise<{ message: string }> {
    const { email, name, role = UserRole.ADMIN, status = UserStatus.ACTIVE, permissions } = createAdminDto;

    // Check if the user with this email already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    // Generate a random password
    const randomPassword = this.passwordGeneratorService.generateRandomPassword(8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Create a new admin user
    const newAdmin = await this.userModel.create({
      name,
      email,
      password: hashedPassword,
      role,
      status,
      permissions: permissions || {
        canViewUsers: true,
        canViewCategories: true,
      },
      emailVerified: true, // Admins are automatically verified
      createdBy: creatorId,
    });

    // Send credentials via email
    await this.emailService.sendAdminAccountCredentials(email, name, randomPassword);

    return {
      message: `Admin user ${name} created successfully. Credentials sent to ${email}`,
    };
  }

  /**
   * Get all users (for admin dashboard)
   */
  async findAll(currentUser: UserDocument): Promise<User[]> {
    // Check if a user has permission to view users
    if (currentUser.role !== UserRole.ADMIN || !currentUser.permissions?.canViewUsers) {
      throw new ForbiddenException('You do not have permission to view users');
    }

    return this.userModel.find().select('-password');
  }

  /**
   * Get user by ID
   */
  async findById(id: string, currentUser: UserDocument): Promise<User> {
    // Check if a user has permission to view users or is viewing their own profile
    if (
      id !== currentUser.id.toString() &&
      (currentUser.role !== UserRole.ADMIN || !currentUser.permissions?.canViewUsers)
    ) {
      throw new ForbiddenException('You do not have permission to view this user');
    }

    const user = await this.userModel.findById(id).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user status (active/inactive)
   */
  async updateStatus(id: string, updateStatusDto: UpdateUserStatusDto, currentUser: UserDocument): Promise<User> {
    // Check if a user has permission to manage users
    if (currentUser.role !== UserRole.ADMIN || !currentUser.permissions?.canManageUsers) {
      throw new ForbiddenException('You do not have permission to change user status');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prevent admins from deactivating themselves
    if (id === currentUser.id.toString() && updateStatusDto.status === UserStatus.INACTIVE) {
      throw new BadRequestException('You cannot deactivate your own account');
    }

    user.status = updateStatusDto.status;
    return user.save();
  }

  /**
   * Update user permissions
   */
  async updatePermissions(
    id: string,
    updatePermissionsDto: UpdateUserPermissionsDto,
    currentUser: UserDocument
  ): Promise<User> {
    // Check if the current user has permission to manage permissions
    if (currentUser.role !== UserRole.ADMIN || !currentUser.permissions?.canManagePermissions) {
      throw new ForbiddenException('You do not have permission to update user permissions');
    }

    const user = await this.userModel.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the target user is an admin
    if (user.role !== UserRole.ADMIN) {
      throw new BadRequestException('Permissions can only be set for admin users');
    }

    // Update permissions
    user.permissions = {
      ...user.permissions,
      ...updatePermissionsDto,
    };

    return user.save();
  }

}
