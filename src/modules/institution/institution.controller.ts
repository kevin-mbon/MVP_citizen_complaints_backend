// modules/institution/institution.controller.ts
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
  Logger,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InstitutionService } from './institution.service';
import { CreateInstitutionDto } from './dto/create‑institution.dto';
import { UpdateInstitutionDto } from './dto/update‑institution.dto';
import { RolesGuard } from '../auth/guards/roles.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/common/enums/user-role';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('institutions')
export class InstitutionController {
  private readonly logger = new Logger(InstitutionController.name);
  
  constructor(private svc: InstitutionService) {}

  @Post() 
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create new institution' })
  @ApiResponse({ status: 201, description: 'Institution created' })
  create(@Req() req, @Body() dto: CreateInstitutionDto) {
    this.logger.debug(`User attempting to create institution: ${JSON.stringify(req.user)}`);
    return this.svc.create(dto);
  }

  @Get() 
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get all institutions' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id') 
  @Roles(UserRole.ADMIN, UserRole.USER)
  @ApiOperation({ summary: 'Get institution by ID' })
  findOne(@Param('id') id: string) {
    return this.svc.findOne(id);
  }

  @Patch(':id') 
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update institution by ID' })
  update(@Param('id') id: string, @Body() dto: UpdateInstitutionDto) {
    return this.svc.update(id, dto);
  }

  @Delete(':id') 
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete institution by ID' })
  remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
