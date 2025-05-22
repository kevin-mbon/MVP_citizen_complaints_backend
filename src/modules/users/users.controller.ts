import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { CreateAdminDto } from '../auth/dto/create-admin.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpdateUserPermissionsDto } from './dto/update-user-permissions.dto';
import {
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
  ApiTags, ApiBody, ApiParam,
} from '@nestjs/swagger';
import { User } from '../auth/schemas/user.schema';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class UsersController {
  constructor(private readonly userService: UsersService) {}


  @Post('admin')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new admin user' })
  @ApiResponse({
    status: 201,
    description: 'Admin user created successfully',
    schema: {
      properties: {
        message: { type: 'string', example: 'Admin user John Doe created successfully. Credentials sent to john@example.com' }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input or email already exists' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiBody({ type: CreateAdminDto })
  async createAdmin(
    @Body() createAdminDto: CreateAdminDto,
    @GetUser('userId') userId: string,
  ) {
    return this.userService.createAdmin(createAdminDto, userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of all users',
    type: [User]
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })

  async findAll(@GetUser() currentUser) {
    return this.userService.findAll(currentUser);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns user details',
    type: User
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string, @GetUser() currentUser) {
    return this.userService.findById(id, currentUser);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user status (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User status updated successfully',
    type: User
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid status' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({ type: UpdateUserStatusDto })
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateUserStatusDto,
    @GetUser() currentUser,
  ) {
    return this.userService.updateStatus(id, updateStatusDto, currentUser);
  }

  @Patch(':id/permissions')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update user permissions (Admin only)' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({
    status: 200,
    description: 'User permissions updated successfully',
    type: User
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid permissions or non-admin user' })
  @ApiResponse({ status: 403, description: 'Forbidden - Insufficient permissions' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({ type: UpdateUserPermissionsDto })
  async updatePermissions(
    @Param('id') id: string,
    @Body() updatePermissionsDto: UpdateUserPermissionsDto,
    @GetUser() currentUser,
  ) {
    return this.userService.updatePermissions(id, updatePermissionsDto, currentUser);
  }

}
