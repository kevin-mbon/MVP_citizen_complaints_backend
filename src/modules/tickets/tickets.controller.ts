import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTicketDto } from './dto/create‐ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketsService } from './tickets.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guards';
import { UserRole } from 'src/common/enums/user-role';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('tickets')
export class TicketController {
  constructor(private svc: TicketsService) {}

  @Post() 
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiResponse({ status: 201, description: 'Ticket created successfully' })
  create(@Req() req, @Body() dto: CreateTicketDto) {
    return this.svc.create(dto, req.user.userId);
  }

  @Get() 
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get all tickets (admin) or user\'s tickets' })
  findAll(@Req() req) {
    return this.svc.findAll(req.user);
  }

  @Get(':id') 
  @Roles(UserRole.ADMIN,UserRole.USER)
  @ApiOperation({ summary: 'Get ticket by ID' })
  findOne(@Req() req, @Param('id') id: string) {
    return this.svc.findOne(id, req.user);
  }

  @Patch(':id') 
  @Roles(UserRole.ADMIN,UserRole.USER)
  @ApiOperation({ summary: 'Update ticket by ID' })
  update(@Req() req, @Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.svc.update(id, dto, req.user);
  }

  @Delete(':id') 
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete ticket by ID' })
  remove(@Req() req, @Param('id') id: string) {
    return this.svc.remove(id, req.user);
  }

}
